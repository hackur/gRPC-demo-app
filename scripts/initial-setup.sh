#!/bin/bash

# gRPC Demo App - Initial Setup Script
set -e

echo "🚀 Setting up gRPC Demo Application..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${YELLOW}→${NC} $1"
}

# Step 1: Create Next.js application
print_info "Creating Next.js application..."
mkdir -p client
cd client

# Create package.json for Next.js app directly
cat > next-app-package.json << 'EOF'
{
  "name": "@grpc-demo/web-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.3.8",
    "zustand": "^4.5.4",
    "recharts": "^2.12.7",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.2",
    "@tanstack/react-virtual": "^3.8.3",
    "react-colorful": "^5.6.1",
    "grpc-web": "^1.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.3",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "tailwindcss": "^3.4.6",
    "postcss": "^8.4.39",
    "autoprefixer": "^10.4.19",
    "@tailwindcss/typography": "^0.5.13",
    "tailwindcss-animate": "^1.0.7"
  }
}
EOF

mkdir -p next-app
mv next-app-package.json next-app/package.json

# Create Next.js config
cat > next-app/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/grpc/:path*',
        destination: `${process.env.NEXT_PUBLIC_GRPC_WEB_URL || 'http://localhost:8080'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
EOF

# Create TypeScript config
cat > next-app/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# Create Tailwind config
cat > next-app/tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg-primary)',
        foreground: 'var(--color-fg-primary)',
        brand: {
          primary: 'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
EOF

# Create PostCSS config
cat > next-app/postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create app directory structure
mkdir -p next-app/src/{app,components,lib,hooks,store,styles}

# Create layout.tsx
cat > next-app/src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'gRPC Demo Application',
  description: 'Advanced gRPC patterns demonstration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

# Create page.tsx
cat > next-app/src/app/page.tsx << 'EOF'
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-foreground">
          gRPC Demo Application
        </h1>
        <p className="mt-4 text-foreground/80">
          Widget-based dashboard with real-time streaming
        </p>
      </div>
    </main>
  )
}
EOF

# Create global styles
cat > next-app/src/styles/globals.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg-primary: #0A0B0D;
  --color-bg-secondary: #141619;
  --color-fg-primary: #FFFFFF;
  --color-brand-primary: #FF6B35;
  --color-brand-secondary: #E85D3C;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

[data-theme="light"] {
  --color-bg-primary: #FAF9F6;
  --color-bg-secondary: #FFFFFF;
  --color-fg-primary: #111827;
  --color-brand-primary: #E85D3C;
  --color-brand-secondary: #FF6B35;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-fg-primary);
}
EOF

print_status "Next.js app structure created"
cd ..

# Step 2: Setup proto package
print_info "Setting up proto definitions..."
mkdir -p packages/protos/src

cat > packages/protos/package.json << 'EOF'
{
  "name": "@grpc-demo/protos",
  "version": "1.0.0",
  "description": "Protocol buffer definitions",
  "main": "dist/index.js",
  "scripts": {
    "generate": "mkdir -p dist && grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./dist --grpc_out=grpc_js:./dist -I ./src ./src/*.proto",
    "clean": "rm -rf dist",
    "build": "npm run clean && npm run generate"
  },
  "devDependencies": {
    "grpc-tools": "^1.12.4",
    "grpc_tools_node_protoc_ts": "^5.3.3"
  }
}
EOF

print_status "Proto package configured"

# Step 3: Setup gRPC server
print_info "Setting up gRPC server..."
mkdir -p services/grpc-server/src

cat > services/grpc-server/package.json << 'EOF'
{
  "name": "@grpc-demo/server",
  "version": "1.0.0",
  "description": "gRPC demo server",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@grpc/grpc-js": "^1.11.1",
    "@grpc/proto-loader": "^0.7.13"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.3"
  }
}
EOF

cat > services/grpc-server/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

print_status "gRPC server configured"

# Step 4: Create workspace configuration
print_info "Configuring workspace..."

# Update root package.json workspaces if needed
if ! grep -q "workspaces" package.json; then
  # Add workspaces to existing package.json
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.workspaces = ['packages/*', 'services/*', 'client/*'];
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  "
fi

print_status "Workspace configured"

echo ""
echo "✨ Initial setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to install all dependencies"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Visit http://localhost:3000 to see the app"