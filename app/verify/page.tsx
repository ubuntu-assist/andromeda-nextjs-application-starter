import React, { Suspense } from 'react'
import { Shield } from 'lucide-react'
import { VerifyClient } from './verify-client'

function VerificationLoading() {
  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b border-border p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <Shield className='w-8 h-8 text-blue-500' />
            <h1 className='text-2xl font-bold'>ChainID</h1>
          </div>
        </div>
      </header>

      <main className='container mx-auto py-12 px-4 flex justify-center items-center'>
        <div className='h-12 w-12 rounded-full border-4 border-t-blue-500 border-b-transparent border-l-transparent border-r-blue-500 animate-spin'></div>
        <p className='ml-4'>Loading verification...</p>
      </main>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerificationLoading />}>
      <VerifyClient />
    </Suspense>
  )
}
