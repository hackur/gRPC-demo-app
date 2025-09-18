/**
 * @fileoverview Home page component for the gRPC demo application.
 * Serves as the landing page with basic application information
 * and introduction to the gRPC streaming capabilities.
 *
 * @author gRPC Demo App Team
 * @version 1.0.0
 */

/**
 * Home page component that displays the application landing page.
 * Provides a welcome message and brief description of the demo application.
 *
 * @component
 * @returns {JSX.Element} The rendered home page
 *
 * @example
 * ```typescript
 * // This component is typically used as the default route
 * // /app/page.tsx
 * export default function Home() {
 *   return <HomePageComponent />;
 * }
 * ```
 */
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
