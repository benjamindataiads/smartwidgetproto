import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartWidgets - E-commerce Personalization Platform',
  description: 'Build and deploy powerful e-commerce personalization widgets without code',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

