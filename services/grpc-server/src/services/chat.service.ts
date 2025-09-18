import * as grpc from '@grpc/grpc-js';

// Chat room manager
class ChatManager {
  private rooms: Map<string, any> = new Map();
  private users: Map<string, any> = new Map();
  private messageHistory: Map<string, any[]> = new Map();

  constructor() {
    this.initializeRooms();
  }

  private initializeRooms() {
    // Create default rooms
    this.createRoom('general', 'General Discussion');
    this.createRoom('tech', 'Technology');
    this.createRoom('random', 'Random Chat');
  }

  createRoom(id: string, name: string) {
    this.rooms.set(id, {
      id,
      name,
      participants: [],
      created_at: new Date(),
    });
    this.messageHistory.set(id, []);
    return this.rooms.get(id);
  }

  addMessage(roomId: string, message: any) {
    const history = this.messageHistory.get(roomId) || [];
    history.push(message);
    if (history.length > 1000) {
      history.shift(); // Keep only last 1000 messages
    }
    this.messageHistory.set(roomId, history);
  }

  getHistory(roomId: string, limit: number) {
    const history = this.messageHistory.get(roomId) || [];
    return history.slice(-limit);
  }
}

export class ChatServiceHandlers {
  private chatManager: ChatManager;
  private activeStreams: Set<grpc.ServerDuplexStream<any, any>> = new Set();

  constructor() {
    this.chatManager = new ChatManager();
  }

  // Bidirectional streaming - Chat
  streamChat(call: grpc.ServerDuplexStream<any, any>) {
    console.log('💬 New chat stream connected');
    this.activeStreams.add(call);

    // Handle incoming messages
    call.on('data', (message: any) => {
      console.log('💬 Received message:', message.message);

      // Add timestamp if not present
      if (!message.timestamp) {
        message.timestamp = new Date();
      }

      // Add message ID if not present
      if (!message.id) {
        message.id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      // Store message in history
      this.chatManager.addMessage(message.room_id || 'general', message);

      // Broadcast to all connected clients
      this.activeStreams.forEach((stream) => {
        if (!stream.destroyed) {
          try {
            stream.write(message);
          } catch (error) {
            console.error('Failed to write to stream:', error);
          }
        }
      });
    });

    // Handle stream end
    call.on('end', () => {
      this.activeStreams.delete(call);
      call.end();
      console.log('💬 Chat stream ended');
    });

    // Handle errors
    call.on('error', (error) => {
      console.error('💬 Chat stream error:', error);
      this.activeStreams.delete(call);
    });

    // Send welcome message
    call.write({
      id: `msg-welcome-${Date.now()}`,
      user_id: 'system',
      username: 'System',
      room_id: 'general',
      message: 'Welcome to the chat!',
      type: 'JOIN',
      timestamp: new Date(),
    });
  }

  // Bidirectional streaming - Presence
  streamPresence(call: grpc.ServerDuplexStream<any, any>) {
    console.log('👥 New presence stream connected');

    const connectedUsers: Set<string> = new Set();

    call.on('data', (presence: any) => {
      console.log('👥 Presence update:', presence);

      // Track user status
      if (presence.status === 'ONLINE') {
        connectedUsers.add(presence.user_id);
      } else if (presence.status === 'OFFLINE') {
        connectedUsers.delete(presence.user_id);
      }

      // Broadcast presence to all clients
      this.activeStreams.forEach((stream) => {
        if (!stream.destroyed) {
          try {
            stream.write(presence);
          } catch (error) {
            console.error('Failed to write presence:', error);
          }
        }
      });
    });

    call.on('end', () => {
      call.end();
      console.log('👥 Presence stream ended');
    });

    call.on('error', (error) => {
      console.error('👥 Presence stream error:', error);
    });
  }

  // Unary - Get chat history
  getChatHistory(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const { room_id, limit } = call.request;
    const messages = this.chatManager.getHistory(room_id || 'general', limit || 50);

    callback(null, { messages });
  }

  // Unary - Create room
  createRoom(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const { name, participant_ids } = call.request;
    const roomId = `room-${Date.now()}`;
    const room = this.chatManager.createRoom(roomId, name);

    if (participant_ids) {
      room.participants = participant_ids;
    }

    callback(null, room);
  }
}