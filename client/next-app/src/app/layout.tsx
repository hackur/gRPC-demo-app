/**
 * @fileoverview Root layout component for the Next.js application.
 * Provides the base HTML structure, font configuration, and theme provider
 * for all pages in the gRPC demo application.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import '../styles/globals.css'

/** Google Fonts configuration for Inter font family */
const inter = Inter({ subsets: ['latin'] })

/** Metadata configuration for SEO and social sharing */
export const metadata: Metadata = {
  title: 'gRPC Demo Application',
  description: 'Advanced gRPC patterns demonstration',
}

/**
 * Root layout component that wraps all pages in the application.
 * Provides base HTML structure, font styling, and theme context.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The root layout HTML structure
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
