'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  FileCheck,
  Check,
  ArrowLeft,
  AlertTriangle,
  PlusCircle,
  MinusCircle,
  Calendar,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAndromedaStore } from '@/zustand/andromeda'
import { ConnectWallet } from '@/modules/wallet'

// Available credential types
const CREDENTIAL_TYPES = [
  {
    id: 'EmailVerification',
    name: 'Email Verification',
    description: 'Verify email ownership',
  },
  {
    id: 'PhoneVerification',
    name: 'Phone Verification',
    description: 'Verify phone number ownership',
  },
  {
    id: 'BasicKYC',
    name: 'Basic KYC',
    description: 'Know Your Customer verification',
  },
  {
    id: 'AgeVerification',
    name: 'Age Verification',
    description: 'Verify age (18+, 21+)',
  },
  {
    id: 'AddressVerification',
    name: 'Address Verification',
    description: 'Verify physical address',
  },
  {
    id: 'EducationCredential',
    name: 'Education Credential',
    description: 'Verify educational achievements',
  },
  {
    id: 'EmploymentVerification',
    name: 'Employment Verification',
    description: 'Verify employment status',
  },
  {
    id: 'IncomeVerification',
    name: 'Income Verification',
    description: 'Verify income level',
  },
  {
    id: 'CreditScore',
    name: 'Credit Score',
    description: 'Verify credit score range',
  },
  {
    id: 'SocialMediaVerification',
    name: 'Social Media Verification',
    description: 'Verify social media account ownership',
  },
  {
    id: 'WebsiteOwnership',
    name: 'Website Ownership',
    description: 'Verify website ownership',
  },
  {
    id: 'DomainVerification',
    name: 'Domain Verification',
    description: 'Verify domain ownership',
  },
]

// Claim templates for each credential type
const CLAIM_TEMPLATES: Record<
  string,
  { key: string; label: string; type: 'string' | 'boolean' | 'number' }[]
> = {
  EmailVerification: [
    { key: 'email', label: 'Email Address', type: 'string' },
    { key: 'email_verified', label: 'Email Verified', type: 'boolean' },
    {
      key: 'verification_method',
      label: 'Verification Method',
      type: 'string',
    },
  ],
  PhoneVerification: [
    { key: 'phone_number', label: 'Phone Number', type: 'string' },
    { key: 'phone_verified', label: 'Phone Verified', type: 'boolean' },
    { key: 'country_code', label: 'Country Code', type: 'string' },
  ],
  AgeVerification: [
    { key: 'over_18', label: 'Over 18', type: 'boolean' },
    { key: 'over_21', label: 'Over 21', type: 'boolean' },
    { key: 'birth_year_range', label: 'Birth Year Range', type: 'string' },
  ],
  BasicKYC: [
    { key: 'name_verified', label: 'Name Verified', type: 'boolean' },
    {
      key: 'id_document_verified',
      label: 'ID Document Verified',
      type: 'boolean',
    },
    { key: 'verification_level', label: 'Verification Level', type: 'string' },
    { key: 'verification_date', label: 'Verification Date', type: 'string' },
  ],
  AddressVerification: [
    { key: 'address_verified', label: 'Address Verified', type: 'boolean' },
    { key: 'country', label: 'Country', type: 'string' },
    { key: 'region', label: 'Region/State', type: 'string' },
    {
      key: 'verification_method',
      label: 'Verification Method',
      type: 'string',
    },
  ],
}

// Default claims for other credential types
const DEFAULT_CLAIMS = [
  { key: 'verified', label: 'Verified', type: 'boolean' as const },
  {
    key: 'verification_method',
    label: 'Verification Method',
    type: 'string' as const,
  },
  {
    key: 'verification_date',
    label: 'Verification Date',
    type: 'string' as const,
  },
]

export default function IssuePage() {
  const router = useRouter()
  const { isConnected, accounts } = useAndromedaStore()

  const [recipientId, setRecipientId] = useState('')
  const [credentialType, setCredentialType] = useState('')
  const [claims, setClaims] = useState<Record<string, any>>({})
  const [customClaimKey, setCustomClaimKey] = useState('')
  const [customClaimValue, setCustomClaimValue] = useState('')
  const [expiration, setExpiration] = useState('')
  const [expirationDays, setExpirationDays] = useState(365)

  const [isIssuing, setIsIssuing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Get the claim fields based on the selected credential type
  const getClaimFields = () => {
    if (!credentialType) return []
    return CLAIM_TEMPLATES[credentialType] || DEFAULT_CLAIMS
  }

  // Handle claim value change
  const handleClaimChange = (key: string, value: any) => {
    setClaims({
      ...claims,
      [key]: value,
    })
  }

  // Add a custom claim
  const handleAddCustomClaim = () => {
    if (!customClaimKey.trim()) return

    setClaims({
      ...claims,
      [customClaimKey]: customClaimValue,
    })

    setCustomClaimKey('')
    setCustomClaimValue('')
  }

  // Remove a claim
  const handleRemoveClaim = (key: string) => {
    const newClaims = { ...claims }
    delete newClaims[key]
    setClaims(newClaims)
  }

  // Handle expiration change
  const handleExpirationChange = (days: number) => {
    setExpirationDays(days)
    // Calculate the expiration timestamp (current time + days in milliseconds)
    const expirationTime = new Date()
    expirationTime.setDate(expirationTime.getDate() + days)
    setExpiration(expirationTime.toISOString())
  }

  // Issue the credential
  const handleIssueCredential = async () => {
    if (!isConnected || !credentialType || !recipientId) {
      setErrorMessage(
        'Please connect your wallet and fill in all required fields'
      )
      return
    }

    try {
      setIsIssuing(true)
      setErrorMessage('')

      // This would typically call the blockchain, but we'll simulate for now
      console.log('Issuing credential:', {
        recipientId,
        credentialType,
        claims,
        expiration: expiration ? new Date(expiration).getTime() : undefined,
      })

      // Simulate blockchain delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsSuccess(true)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (error) {
      console.error('Error issuing credential:', error)
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to issue credential'
      )
    } finally {
      setIsIssuing(false)
    }
  }

  // Render success state
  if (isSuccess) {
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

        <main className='container mx-auto py-16 px-4 flex justify-center'>
          <Card className='max-w-md w-full'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-full inline-block'>
                <Check className='w-8 h-8 text-green-500' />
              </div>
              <CardTitle>Credential Issued</CardTitle>
              <CardDescription>
                The credential has been successfully issued to the recipient
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center'>
              <p className='mb-4'>
                <span className='font-medium'>Credential Type:</span>{' '}
                {CREDENTIAL_TYPES.find((type) => type.id === credentialType)
                  ?.name || credentialType}
              </p>
              <p className='mb-4'>
                <span className='font-medium'>Recipient ID:</span> {recipientId}
              </p>
            </CardContent>
            <CardFooter className='flex justify-center'>
              <Button asChild>
                <Link href='/dashboard'>Return to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
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
        <div className='mb-8'>
          <Button variant='outline' asChild className='flex items-center gap-2'>
            <Link href='/dashboard'>
              <ArrowLeft className='w-4 h-4' />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className='max-w-2xl mx-auto'>
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2 mb-1'>
                <FileCheck className='w-6 h-6 text-blue-500' />
                <CardTitle>Issue New Credential</CardTitle>
              </div>
              <CardDescription>
                Create and issue a verifiable credential to a recipient
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorMessage && (
                <div className='mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-md flex items-start gap-2'>
                  <AlertTriangle className='w-5 h-5 text-red-500 flex-shrink-0 mt-0.5' />
                  <div className='text-red-700 dark:text-red-400 text-sm'>
                    {errorMessage}
                  </div>
                </div>
              )}

              <div className='space-y-6'>
                {/* Recipient ID */}
                <div className='space-y-2'>
                  <Label htmlFor='recipient'>Recipient ID</Label>
                  <Input
                    id='recipient'
                    placeholder='Enter recipient identity ID'
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    required
                  />
                  <p className='text-sm text-muted-foreground'>
                    The identity ID of the recipient who will receive this
                    credential
                  </p>
                </div>

                {/* Credential Type */}
                <div className='space-y-2'>
                  <Label htmlFor='credential-type'>Credential Type</Label>
                  <Select
                    value={credentialType}
                    onValueChange={setCredentialType}
                  >
                    <SelectTrigger id='credential-type'>
                      <SelectValue placeholder='Select credential type' />
                    </SelectTrigger>
                    <SelectContent>
                      {CREDENTIAL_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className='text-sm text-muted-foreground'>
                    The type of credential being issued
                  </p>
                </div>

                {/* Claims */}
                {credentialType && (
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <Label>Credential Claims</Label>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='h-8 text-sm'
                        onClick={() => {
                          // Initialize claims with template defaults
                          const template = getClaimFields()
                          const defaultClaims: Record<string, any> = {}
                          template.forEach((field) => {
                            if (field.type === 'boolean')
                              defaultClaims[field.key] = false
                            else if (field.type === 'number')
                              defaultClaims[field.key] = 0
                            else defaultClaims[field.key] = ''
                          })
                          setClaims(defaultClaims)
                        }}
                      >
                        Reset to Default
                      </Button>
                    </div>

                    <div className='space-y-4 border rounded-md p-4'>
                      {getClaimFields().map((field) => (
                        <div
                          key={field.key}
                          className='flex items-center gap-3'
                        >
                          <div className='flex-grow space-y-2'>
                            <Label htmlFor={`claim-${field.key}`}>
                              {field.label}
                            </Label>
                            {field.type === 'boolean' ? (
                              <Select
                                value={claims[field.key]?.toString() || 'false'}
                                onValueChange={(value) =>
                                  handleClaimChange(field.key, value === 'true')
                                }
                              >
                                <SelectTrigger id={`claim-${field.key}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='true'>True</SelectItem>
                                  <SelectItem value='false'>False</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : field.type === 'number' ? (
                              <Input
                                id={`claim-${field.key}`}
                                type='number'
                                value={claims[field.key] || ''}
                                onChange={(e) =>
                                  handleClaimChange(
                                    field.key,
                                    Number(e.target.value)
                                  )
                                }
                              />
                            ) : (
                              <Input
                                id={`claim-${field.key}`}
                                value={claims[field.key] || ''}
                                onChange={(e) =>
                                  handleClaimChange(field.key, e.target.value)
                                }
                              />
                            )}
                          </div>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => handleRemoveClaim(field.key)}
                            className='h-8 w-8 mt-6'
                          >
                            <MinusCircle className='w-4 h-4 text-red-500' />
                          </Button>
                        </div>
                      ))}

                      {/* Custom claim input */}
                      <div className='pt-4 border-t'>
                        <Label className='mb-2 block'>Add Custom Claim</Label>
                        <div className='flex gap-2'>
                          <Input
                            placeholder='Claim Key'
                            value={customClaimKey}
                            onChange={(e) => setCustomClaimKey(e.target.value)}
                            className='flex-grow'
                          />
                          <Input
                            placeholder='Claim Value'
                            value={customClaimValue}
                            onChange={(e) =>
                              setCustomClaimValue(e.target.value)
                            }
                            className='flex-grow'
                          />
                          <Button
                            type='button'
                            variant='outline'
                            onClick={handleAddCustomClaim}
                            className='flex items-center gap-1'
                          >
                            <PlusCircle className='w-4 h-4' />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expiration Settings */}
                <div className='space-y-2'>
                  <Label>Credential Expiration</Label>
                  <div className='border rounded-md p-4'>
                    <div className='flex items-center gap-4 mb-4'>
                      <div className='p-2 bg-blue-100 dark:bg-blue-900 rounded-full'>
                        <Calendar className='w-5 h-5 text-blue-500' />
                      </div>
                      <div>
                        <p className='font-medium'>Set expiration period</p>
                        <p className='text-sm text-muted-foreground'>
                          Credentials can be set to expire after a specific
                          period
                        </p>
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <Button
                          type='button'
                          variant={
                            expirationDays === 90 ? 'default' : 'outline'
                          }
                          className='justify-start'
                          onClick={() => handleExpirationChange(90)}
                        >
                          <Clock className='w-4 h-4 mr-2' />3 Months
                        </Button>
                        <Button
                          type='button'
                          variant={
                            expirationDays === 180 ? 'default' : 'outline'
                          }
                          className='justify-start'
                          onClick={() => handleExpirationChange(180)}
                        >
                          <Clock className='w-4 h-4 mr-2' />6 Months
                        </Button>
                        <Button
                          type='button'
                          variant={
                            expirationDays === 365 ? 'default' : 'outline'
                          }
                          className='justify-start'
                          onClick={() => handleExpirationChange(365)}
                        >
                          <Clock className='w-4 h-4 mr-2' />1 Year
                        </Button>
                        <Button
                          type='button'
                          variant={
                            expirationDays === 1095 ? 'default' : 'outline'
                          }
                          className='justify-start'
                          onClick={() => handleExpirationChange(1095)}
                        >
                          <Clock className='w-4 h-4 mr-2' />3 Years
                        </Button>
                      </div>

                      <div className='flex items-center gap-2'>
                        <p className='text-sm text-muted-foreground flex-shrink-0'>
                          Custom period (days):
                        </p>
                        <Input
                          type='number'
                          min='1'
                          value={expirationDays}
                          onChange={(e) =>
                            handleExpirationChange(Number(e.target.value))
                          }
                        />
                      </div>

                      {expiration && (
                        <p className='text-sm'>
                          Expires on:{' '}
                          <span className='font-medium'>
                            {new Date(expiration).toLocaleDateString()}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button
                variant='outline'
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                onClick={handleIssueCredential}
                disabled={
                  isIssuing || !isConnected || !credentialType || !recipientId
                }
                className='min-w-[120px]'
              >
                {isIssuing ? (
                  <>
                    <div className='h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2'></div>
                    Issuing...
                  </>
                ) : (
                  <>Issue Credential</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
