import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'pymA - AI Support Agent',
  description: 'Your FAQ-powered AI support agent. $0.01/message or $29/month. Start free.',
  openGraph: {
    title: 'pymA - AI Support Agent',
    description: 'Your FAQ-powered AI support agent. $0.01/message or $29/month. Start free.',
    url: 'https://pyma.pym.ink',
    siteName: 'pymA',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
