import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'THETA Demo - Trading Performance System',
  description: 'Experience the complete THETA trading ecosystem. Biometrics, AI Insights, Journal, Analytics, and Automation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
