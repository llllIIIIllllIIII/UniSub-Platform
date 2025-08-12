import './globals.css'
import type { Metadata } from 'next'
import { Web3Provider } from '../lib/Web3Context'
import { LanguageProvider } from '../lib/LanguageContext'
import NetworkSwitchPrompt from '../components/NetworkSwitchPrompt'

export const metadata: Metadata = {
  title: 'UniSub Platform - Decentralized NFT Subscription Platform',
  description: 'A blockchain-based NFT subscription platform on Morph Holesky Testnet',
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
            <NetworkSwitchPrompt />
            {children}
          </Web3Provider>
        </LanguageProvider>
      </body>
    </html>
  )
}