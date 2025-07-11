import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meikify',
  description: 'Created by Metras',
  generator: 'metras',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
