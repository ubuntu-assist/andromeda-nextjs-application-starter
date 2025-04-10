'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import GridBackground from '@/components/GridBackground'
import { useAndromedaStore } from '@/zustand/andromeda'
import { ConnectWallet } from '@/modules/wallet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Key,
  FileCheck,
  ClipboardCheck,
  History,
  MessageSquare,
  Shield,
  AlertTriangle,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { IDENTITY_REGISTRY, CREDENTIAL_FACTORY } from '@/lib/chainid/ados'

export default function Dashboard() {
  const router = useRouter()
  const { client, isConnected, accounts } = useAndromedaStore()
  const [identity, setIdentity] = useState<IDENTITY_REGISTRY.Identity | null>(
    null
  )
  const [credentials, setCredentials] = useState<
    CREDENTIAL_FACTORY.Credential[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConnected && !loading) {
      router.push('/')
    }
  }, [isConnected, loading, router])

  useEffect(() => {
    const fetchIdentityData = async () => {
      if (isConnected && client && accounts.length > 0) {
        try {
          // This is a mock implementation - in reality we would query the ADOs
          setLoading(true)

          // Simulate fetching identity
          setTimeout(() => {
            setIdentity({
              id: 'id_' + accounts[0].address.substring(0, 8),
              owner: accounts[0].address,
              created_at: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
              updated_at: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
              metadata: {
                display_name: 'User_' + accounts[0].address.substring(0, 6),
                profile_image: null,
                recovery_addresses: [],
              },
              active: true,
            })

            // Simulate fetching credentials
            setCredentials([
              {
                id: 'cred_1',
                issuer: 'andr1issuer123456789abcdef',
                recipient_id: 'id_' + accounts[0].address.substring(0, 8),
                credential_type: 'EmailVerification',
                claims: {
                  email_verified: true,
                  email_domain: 'example.com',
                },
                issued_at: Date.now() - 25 * 24 * 60 * 60 * 1000,
                expiration: Date.now() + 365 * 24 * 60 * 60 * 1000,
                revoked: false,
              },
              {
                id: 'cred_2',
                issuer: 'andr1issuer987654321fedcba',
                recipient_id: 'id_' + accounts[0].address.substring(0, 8),
                credential_type: 'AgeVerification',
                claims: {
                  over_18: true,
                  over_21: true,
                  birth_year_range: '1980-1990',
                },
                issued_at: Date.now() - 15 * 24 * 60 * 60 * 1000,
                expiration: Date.now() + 180 * 24 * 60 * 60 * 1000,
                revoked: false,
              },
            ])

            setLoading(false)
          }, 1000)
        } catch (error) {
          console.error('Failed to fetch identity data:', error)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchIdentityData()
  }, [isConnected, client, accounts])

  if (!isConnected) {
    return (
      <GridBackground>
        <div className='flex flex-col min-h-screen items-center justify-center gap-4'>
          <Shield className='w-16 h-16 text-blue-500 mb-4' />
          <h1 className='text-3xl font-bold mb-6'>
            Connect to Access Your Identity
          </h1>
          <ConnectWallet />
        </div>
      </GridBackground>
    )
  }

  if (loading) {
    return (
      <GridBackground>
        <div className='flex flex-col min-h-screen items-center justify-center gap-4'>
          <div className='h-12 w-12 rounded-full border-4 border-t-blue-500 border-b-transparent border-l-transparent border-r-blue-500 animate-spin'></div>
          <p>Loading your decentralized identity...</p>
        </div>
      </GridBackground>
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
          <ConnectWallet />
        </div>
      </header>

      <main className='container mx-auto py-8 px-4'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
          <div>
            <h1 className='text-3xl font-bold'>Identity Dashboard</h1>
            <p className='text-muted-foreground mt-1'>
              {identity
                ? identity.metadata.display_name
                : 'Welcome to your decentralized identity'}
            </p>
          </div>
          {!identity ? (
            <Button className='flex items-center gap-2'>
              <Plus className='w-4 h-4' />
              Create Identity
            </Button>
          ) : (
            <Badge
              variant='outline'
              className='px-3 py-1 text-base flex items-center gap-2'
            >
              <Key className='w-4 h-4' />
              {`ID: ${identity.id}`}
            </Badge>
          )}
        </div>

        {identity ? (
          <Tabs defaultValue='credentials' className='w-full'>
            <TabsList className='mb-6'>
              <TabsTrigger
                value='credentials'
                className='flex items-center gap-2'
              >
                <FileCheck className='w-4 h-4' />
                Credentials
              </TabsTrigger>
              <TabsTrigger value='requests' className='flex items-center gap-2'>
                <MessageSquare className='w-4 h-4' />
                Verification Requests
              </TabsTrigger>
              <TabsTrigger value='history' className='flex items-center gap-2'>
                <History className='w-4 h-4' />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value='credentials'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {credentials.map((credential) => (
                  <Card key={credential.id}>
                    <CardHeader>
                      <div className='flex justify-between items-start'>
                        <CardTitle>{credential.credential_type}</CardTitle>
                        <Badge
                          variant={
                            credential.revoked ? 'destructive' : 'secondary'
                          }
                        >
                          {credential.revoked ? 'Revoked' : 'Active'}
                        </Badge>
                      </div>
                      <CardDescription>
                        Issued{' '}
                        {new Date(credential.issued_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-2'>
                        {Object.entries(credential.claims).map(
                          ([key, value]) => (
                            <div key={key} className='flex justify-between'>
                              <span className='text-muted-foreground'>
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className='font-medium'>
                                {String(value)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className='flex justify-between'>
                      <div className='text-sm text-muted-foreground'>
                        {credential.expiration ? (
                          <>
                            Expires:{' '}
                            {new Date(
                              credential.expiration
                            ).toLocaleDateString()}
                          </>
                        ) : (
                          <>No expiration</>
                        )}
                      </div>
                      <Button variant='outline' size='sm'>
                        Share
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                <Card className='border-dashed'>
                  <CardHeader>
                    <CardTitle>Add New Credential</CardTitle>
                    <CardDescription>
                      Request or import verifiable credentials
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex items-center justify-center py-8'>
                    <Button
                      variant='outline'
                      className='flex items-center gap-2'
                    >
                      <Plus className='w-4 h-4' />
                      Request Credential
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='requests'>
              <div className='rounded-lg border border-border p-8 text-center'>
                <ClipboardCheck className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-xl font-medium mb-2'>No Active Requests</h3>
                <p className='text-muted-foreground mb-6'>
                  Verification requests from third parties will appear here
                </p>
                <Button variant='outline'>View History</Button>
              </div>
            </TabsContent>

            <TabsContent value='history'>
              <div className='space-y-4'>
                <div className='rounded-lg border border-border p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='bg-blue-100 dark:bg-blue-900 p-2 rounded-full'>
                      <FileCheck className='w-5 h-5 text-blue-500' />
                    </div>
                    <div>
                      <p className='font-medium'>
                        Email Verification Credential Received
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(
                          credentials[0]?.issued_at || Date.now()
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button variant='ghost' size='sm'>
                    View
                  </Button>
                </div>

                <div className='rounded-lg border border-border p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='bg-green-100 dark:bg-green-900 p-2 rounded-full'>
                      <Shield className='w-5 h-5 text-green-500' />
                    </div>
                    <div>
                      <p className='font-medium'>Identity Created</p>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(identity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button variant='ghost' size='sm'>
                    View
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className='rounded-lg border border-border p-8 text-center max-w-2xl mx-auto'>
            <AlertTriangle className='w-16 h-16 text-yellow-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold mb-2'>No Identity Found</h2>
            <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
              You need to create a decentralized identity to start managing your
              verifiable credentials.
            </p>
            <Button className='flex items-center gap-2'>
              <Plus className='w-4 h-4' />
              Create Identity
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
