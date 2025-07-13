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
      <head>
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180"
        href="/images/favicon-180x180.png" />
        <link rel="icon" type="image/png" sizes="32x32"
        href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16"
        href="/images/favicon-16x16.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
