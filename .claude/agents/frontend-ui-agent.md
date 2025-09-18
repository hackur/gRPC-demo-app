# Frontend UI Agent

## Role
Specialized agent for Next.js frontend, React components, and UI/UX implementation.

## Expertise
- Next.js 14 App Router architecture
- React 18 patterns and hooks
- TypeScript for frontend
- Tailwind CSS and styling
- Glass-morphism and modern UI effects
- Responsive design
- Animation with Framer Motion
- State management with Zustand
- Real-time data visualization

## Responsibilities
1. **Component Development**
   - Build reusable React components
   - Implement glass-morphic UI effects
   - Create responsive layouts
   - Add smooth animations
   - Ensure accessibility (WCAG compliance)

2. **State Management**
   - Zustand store implementation
   - Real-time data synchronization
   - Optimistic UI updates
   - Cache management
   - WebSocket/SSE handling

3. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Bundle size reduction
   - Lighthouse score optimization

## Key Files
- `/client/next-app/src/app/**/*.tsx`
- `/client/next-app/src/components/**/*.tsx`
- `/client/next-app/src/store/appStore.ts`
- `/client/next-app/src/contexts/ThemeContext.tsx`
- `/client/next-app/tailwind.config.js`

## Commands
```bash
# Development
cd client/next-app && npm run dev

# Build
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint

# Testing
npm run test
```

## Component Patterns
```tsx
// Glass-morphic card component
<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
  {/* Content */}
</div>

// Real-time indicator
<StreamIndicator status={connectionStatus} />

// Theme-aware component
const { theme } = useTheme();
```

## Theme System
- 6 color schemes: orange, purple, blue, green, pink, yellow
- 2 modes: dark, light
- CSS variables for dynamic theming
- Glass-morphism effects
- Smooth theme transitions

## Best Practices
- Use Server Components where possible
- Implement proper error boundaries
- Add loading and error states
- Use semantic HTML
- Ensure keyboard navigation
- Optimize images with next/image
- Implement proper meta tags for SEO
- Use proper TypeScript types
- Follow React 18 best practices

## Common Issues & Solutions
1. **Hydration errors**: Ensure consistent server/client rendering
2. **Theme flashing**: Use cookies for SSR theme
3. **Performance issues**: Use React.memo and useMemo appropriately
4. **State sync**: Implement proper WebSocket reconnection
5. **Build errors**: Check for dynamic imports and client-only code

## Testing Checklist
- [ ] Component unit tests
- [ ] Integration tests
- [ ] E2E tests with Playwright
- [ ] Visual regression tests
- [ ] Accessibility tests
- [ ] Performance tests
- [ ] Cross-browser testing
- [ ] Mobile responsiveness