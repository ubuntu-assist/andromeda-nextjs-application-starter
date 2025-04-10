import React, { ReactNode } from 'react'
import '@/styles/globals.css'
import Providers from './providers'
import { Metadata } from 'next'
import PoweredByLogo from '@/modules/ui/PoweredByLogo'

export const metadata: Metadata = {
  title: {
    default: 'ChainID - Decentralized Identity & Credentials',
    template: '%s | ChainID',
  },
  description:
    'A decentralized identity and credential verification system built on the Andromeda Protocol.',
  keywords: [
    'blockchain',
    'decentralized identity',
    'DID',
    'verifiable credentials',
    'Andromeda',
    'ChainID',
    'self-sovereign identity',
  ],
  authors: [{ name: 'Duclair Fopa Kuete', url: '' }],
}

interface Props {
  children?: ReactNode
}

const RootLayout = async (props: Props) => {
  const { children } = props

  return (
    <html lang='en'>
      <body className='dark'>
        <Providers>
          {children}
          <PoweredByLogo />
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
