'use client'

import GridBackground from '@/components/GridBackground'
import { useChainConfig } from '@/lib/andrjs/hooks/useChainConfig'
import { useAndromedaStore } from '@/zustand/andromeda'
import React from 'react'
import { ConnectWallet } from '../wallet'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Shield, Key, FileCheck } from 'lucide-react'

interface Props {}

const LandingPage: React.FC<Props> = (props) => {
  const { connectedChain } = useAndromedaStore()
  const { data, isLoading } = useChainConfig(connectedChain || '')
  return (
    <GridBackground>
      <div className='flex flex-col min-h-screen items-center justify-center gap-6 px-4 max-w-6xl mx-auto text-center'>
        <div className='flex items-center justify-center gap-2'>
          <Shield className='w-12 h-12 text-blue-500' />
          <h1 className='text-4xl md:text-6xl font-bold'>ChainID</h1>
        </div>
        <h2 className='text-2xl md:text-3xl font-semibold mt-2'>
          Decentralized Identity & Credential Verification
        </h2>

        <p className='text-xl max-w-3xl'>
          Control your identity. Own your credentials. Verify without revealing.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
          <div className='flex flex-col items-center p-6 rounded-lg bg-background/50 backdrop-blur-md border border-border'>
            <Key className='w-12 h-12 text-blue-500 mb-4' />
            <h3 className='text-xl font-medium mb-2'>
              Self-Sovereign Identity
            </h3>
            <p className='text-center text-muted-foreground'>
              Create and fully control your digital identity with cryptographic
              keys.
            </p>
          </div>

          <div className='flex flex-col items-center p-6 rounded-lg bg-background/50 backdrop-blur-md border border-border'>
            <FileCheck className='w-12 h-12 text-blue-500 mb-4' />
            <h3 className='text-xl font-medium mb-2'>Verifiable Credentials</h3>
            <p className='text-center text-muted-foreground'>
              Receive, store, and present cryptographically secure credentials.
            </p>
          </div>

          <div className='flex flex-col items-center p-6 rounded-lg bg-background/50 backdrop-blur-md border border-border'>
            <Shield className='w-12 h-12 text-blue-500 mb-4' />
            <h3 className='text-xl font-medium mb-2'>Privacy-Preserving</h3>
            <p className='text-center text-muted-foreground'>
              Share only what you need with zero-knowledge proofs.
            </p>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 mt-8'>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <ConnectWallet />
              <Button asChild variant='outline'>
                <Link href='/dashboard'>
                  Explore Dashboard
                  <ArrowRight className='ml-2 w-4 h-4' />
                </Link>
              </Button>
            </>
          )}
        </div>

        <p className='text-sm text-muted-foreground mt-8'>
          Built on the Andromeda Protocol for secure, interoperable identity
          verification
        </p>
      </div>
    </GridBackground>
  )
}

export default LandingPage
