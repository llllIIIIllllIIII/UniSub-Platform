import './globals.css'
import type { Metadata } from 'next'
import { Web3Provider } from '../lib/Web3Context'
import { LanguageProvider } from '../lib/LanguageContext'

export const metadata: Metadata = {
  title: 'Unisub - NFT Subscription Platform',
  description: 'The Future of Content Subscription: NFT Access Pass',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-inter antialiased">
        <LanguageProvider>
          <Web3Provider>
            {children}
          </Web3Provider>
        </LanguageProvider>
      </body>
    </html>
  )
}