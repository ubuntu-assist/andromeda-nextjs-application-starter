'use client'

import { useSearchParams } from 'next/navigation'
import { Shield, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useAndromedaStore } from '@/zustand/andromeda'
import { ConnectWallet } from '@/modules/wallet'
import { useState } from 'react'
import { VERIFICATION_CONTROLLER } from '../../src/lib/chainid/ados'

function VerifyClient() {
  const searchParams = useSearchParams()
  const credentialId = searchParams.get('credential_id')
  const requestType = searchParams.get('type') || 'credential'
  const claimKey = searchParams.get('claim_key')
  const expectedValue = searchParams.get('expected_value')

  const { isConnected } = useAndromedaStore()
  const [verificationResult, setVerificationResult] =
    useState<VERIFICATION_CONTROLLER.VerifyCredentialResponse | null>(null)
  const [claimResult, setClaimResult] =
    useState<VERIFICATION_CONTROLLER.VerifyClaimResponse | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  // This would usually connect to the blockchain, but we'll simulate for now
  const verifyCredential = async () => {
    setIsVerifying(true)

    // Simulate blockchain verification delay
    setTimeout(() => {
      if (requestType === 'credential') {
        // Simulate credential verification
        setVerificationResult({
          valid: true,
          expired: false,
          revoked: false,
        })
      } else if (requestType === 'claim' && claimKey && expectedValue) {
        // Simulate claim verification
        setClaimResult({
          valid: true,
          message: 'Claim verified successfully',
        })
      }
      setIsVerifying(false)
    }, 2000)
  }

  const renderVerificationState = () => {
    if (!credentialId) {
      return (
        <Card className='max-w-md mx-auto'>
          <CardHeader>
            <CardTitle>Invalid Request</CardTitle>
            <CardDescription>No credential ID provided</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              Please scan a valid verification QR code or check the URL
              parameters.
            </p>
          </CardContent>
        </Card>
      )
    }

    if (isVerifying) {
      return (
        <Card className='max-w-md mx-auto'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full inline-block'>
              <Clock className='w-8 h-8 text-blue-500 animate-pulse' />
            </div>
            <CardTitle>Verifying Credential</CardTitle>
            <CardDescription>
              Please wait while we verify the credential on the Andromeda
              blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center'>
            <div className='h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
              <div className='h-full bg-blue-500 animate-progress-indeterminate'></div>
            </div>
            <p className='mt-4 text-sm text-muted-foreground'>
              Checking validity, expiration, and revocation status...
            </p>
          </CardContent>
        </Card>
      )
    }

    if (verificationResult || claimResult) {
      const isValid = verificationResult
        ? verificationResult.valid &&
          !verificationResult.expired &&
          !verificationResult.revoked
        : claimResult?.valid

      return (
        <Card className='max-w-md mx-auto'>
          <CardHeader className='text-center'>
            <div
              className={`mx-auto mb-4 p-3 ${isValid ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'} rounded-full inline-block`}
            >
              {isValid ? (
                <CheckCircle className='w-8 h-8 text-green-500' />
              ) : (
                <XCircle className='w-8 h-8 text-red-500' />
              )}
            </div>
            <CardTitle>
              {isValid ? 'Verification Successful' : 'Verification Failed'}
            </CardTitle>
            <CardDescription>
              {requestType === 'credential'
                ? 'Credential status'
                : 'Claim verification'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-2 border-b'>
                <span className='text-muted-foreground'>Credential ID:</span>
                <span className='font-mono text-sm'>{credentialId}</span>
              </div>

              {requestType === 'credential' && verificationResult && (
                <>
                  <div className='flex justify-between items-center p-2 border-b'>
                    <span className='text-muted-foreground'>
                      Valid Signature:
                    </span>
                    <Badge
                      variant={
                        verificationResult.valid ? 'default' : 'destructive'
                      }
                    >
                      {verificationResult.valid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center p-2 border-b'>
                    <span className='text-muted-foreground'>
                      Expiration Status:
                    </span>
                    <Badge
                      variant={
                        !verificationResult.expired ? 'default' : 'destructive'
                      }
                    >
                      {!verificationResult.expired ? 'Active' : 'Expired'}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center p-2 border-b'>
                    <span className='text-muted-foreground'>
                      Revocation Status:
                    </span>
                    <Badge
                      variant={
                        !verificationResult.revoked ? 'default' : 'destructive'
                      }
                    >
                      {!verificationResult.revoked ? 'Not Revoked' : 'Revoked'}
                    </Badge>
                  </div>
                </>
              )}

              {requestType === 'claim' && claimResult && (
                <>
                  <div className='flex justify-between items-center p-2 border-b'>
                    <span className='text-muted-foreground'>Claim Key:</span>
                    <span>{claimKey}</span>
                  </div>
                  <div className='flex justify-between items-center p-2 border-b'>
                    <span className='text-muted-foreground'>
                      Expected Value:
                    </span>
                    <span>{expectedValue}</span>
                  </div>
                  <div className='flex justify-between items-center p-2 border-b'>
                    <span className='text-muted-foreground'>Verification:</span>
                    <Badge
                      variant={claimResult.valid ? 'default' : 'destructive'}
                    >
                      {claimResult.valid ? 'Verified' : 'Failed'}
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button
              variant='outline'
              onClick={() => setShowDetailsDialog(true)}
            >
              View Details
            </Button>
            <Button className='flex items-center gap-1'>
              Done <ArrowRight className='w-4 h-4' />
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return (
      <Card className='max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Verify Credential</CardTitle>
          <CardDescription>
            {requestType === 'credential'
              ? 'Verify the authenticity of this credential'
              : `Verify that the claim "${claimKey}" matches the expected value`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='rounded-lg border border-dashed p-6 text-center'>
            <Shield className='w-12 h-12 mx-auto mb-4 text-blue-500' />
            <h3 className='font-medium mb-2'>Ready to Verify</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              {requestType === 'credential'
                ? 'This will check if the credential is valid, not expired, and not revoked.'
                : 'This will verify a specific claim without revealing other credential data.'}
            </p>
            <div className='text-xs text-muted-foreground p-2 bg-muted rounded-md font-mono mb-4'>
              {credentialId}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {isConnected ? (
            <Button className='w-full' onClick={verifyCredential}>
              Verify Now
            </Button>
          ) : (
            <ConnectWallet />
          )}
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b border-border p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <Shield className='w-8 h-8 text-blue-500' />
            <h1 className='text-2xl font-bold'>ChainID</h1>
          </div>
          {isConnected && <ConnectWallet />}
        </div>
      </header>

      <main className='container mx-auto py-12 px-4'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          Credential Verification
        </h1>
        {renderVerificationState()}
      </main>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
            <DialogDescription>
              Technical details about this verification
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='p-3 bg-muted rounded-md'>
              <h4 className='font-medium mb-1 text-sm'>Transaction Hash</h4>
              <p className='font-mono text-xs break-all'>
                0x7f9e4bc3a01d87801b1c31e5a568e8472d871b52ae1260694dc5e3c835428274
              </p>
            </div>

            <div className='p-3 bg-muted rounded-md'>
              <h4 className='font-medium mb-1 text-sm'>
                Verification Contract
              </h4>
              <p className='font-mono text-xs break-all'>
                andr1verificationcontract123456789abcdef
              </p>
            </div>

            <div className='p-3 bg-muted rounded-md'>
              <h4 className='font-medium mb-1 text-sm'>Verified At</h4>
              <p className='text-xs'>{new Date().toLocaleString()}</p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { VerifyClient }
