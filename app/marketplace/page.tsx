'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Shield,
  Store,
  Star,
  ArrowRight,
  Filter,
  Search,
  Check,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAndromedaStore } from '@/zustand/andromeda'
import { ConnectWallet } from '@/modules/wallet'
import { CREDENTIAL_MARKETPLACE } from '../../src/lib/chainid/ados'

// Mock data for the marketplace
const MOCK_ISSUERS: CREDENTIAL_MARKETPLACE.IssuerInfo[] = [
  {
    identity_id: 'id_andr1abc123',
    credential_types: ['EmailVerification', 'PhoneVerification', 'BasicKYC'],
    fees: {
      EmailVerification: '5000uandr',
      PhoneVerification: '10000uandr',
      BasicKYC: '50000uandr',
    },
    rating: 4.8,
    verified: true,
  },
  {
    identity_id: 'id_andr1def456',
    credential_types: [
      'AgeVerification',
      'AddressVerification',
      'EducationCredential',
    ],
    fees: {
      AgeVerification: '15000uandr',
      AddressVerification: '20000uandr',
      EducationCredential: '100000uandr',
    },
    rating: 4.6,
    verified: true,
  },
  {
    identity_id: 'id_andr1ghi789',
    credential_types: [
      'EmploymentVerification',
      'IncomeVerification',
      'CreditScore',
    ],
    fees: {
      EmploymentVerification: '30000uandr',
      IncomeVerification: '40000uandr',
      CreditScore: '25000uandr',
    },
    rating: 4.2,
    verified: true,
  },
  {
    identity_id: 'id_andr1jkl012',
    credential_types: [
      'SocialMediaVerification',
      'WebsiteOwnership',
      'DomainVerification',
    ],
    fees: {
      SocialMediaVerification: '8000uandr',
      WebsiteOwnership: '15000uandr',
      DomainVerification: '12000uandr',
    },
    rating: 3.9,
    verified: false,
  },
]

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

function formatAndrPrice(price: string): string {
  if (!price) return '0 ANDR'

  const numericValue = price.replace(/\D/g, '')
  const valueInANDR = parseInt(numericValue) / 1000000
  return `${valueInANDR} ANDR`
}

export default function MarketplacePage() {
  const { isConnected } = useAndromedaStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)

  // Filter issuers based on search query and filters
  const filteredIssuers = MOCK_ISSUERS.filter((issuer) => {
    // Filter by verification status if enabled
    if (showVerifiedOnly && !issuer.verified) {
      return false
    }

    // Filter by credential type if selected
    if (selectedType && !issuer.credential_types.includes(selectedType)) {
      return false
    }

    // Filter by search query (match against ID or credential types)
    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase()
      const matchesId = issuer.identity_id
        .toLowerCase()
        .includes(normalizedQuery)
      const matchesCredentialType = issuer.credential_types.some((type) =>
        type.toLowerCase().includes(normalizedQuery)
      )

      return matchesId || matchesCredentialType
    }

    return true
  })

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b border-border p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <Shield className='w-8 h-8 text-blue-500' />
            <h1 className='text-2xl font-bold'>ChainID</h1>
          </div>
          <div className='flex items-center gap-4'>
            <Link href='/dashboard'>
              <Button variant='ghost'>Dashboard</Button>
            </Link>
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className='container mx-auto py-8 px-4'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
          <div>
            <h1 className='text-3xl font-bold'>Credential Marketplace</h1>
            <p className='text-muted-foreground mt-1'>
              Find trusted issuers for verifiable credentials
            </p>
          </div>
          <Button className='flex items-center gap-2' disabled={!isConnected}>
            <Store className='w-4 h-4' />
            Register as Issuer
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className='bg-card rounded-lg p-4 mb-8 border border-border'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='relative flex-grow'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input
                placeholder='Search by issuer ID or credential type'
                className='pl-10'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='flex gap-4'>
              <div className='relative inline-block text-left flex-grow md:flex-grow-0'>
                <select
                  className='block w-full rounded-md border border-input bg-transparent py-2 pl-3 pr-10 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
                  value={selectedType || ''}
                  onChange={(e) => setSelectedType(e.target.value || null)}
                >
                  <option value=''>All Credential Types</option>
                  {CREDENTIAL_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <Filter className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none' />
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='verified-only'
                  checked={showVerifiedOnly}
                  onChange={() => setShowVerifiedOnly(!showVerifiedOnly)}
                  className='rounded border-gray-300'
                />
                <label
                  htmlFor='verified-only'
                  className='text-sm flex items-center gap-1'
                >
                  <CheckCircle className='w-4 h-4 text-blue-500' />
                  Verified Only
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Credential Types Section */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>
            Popular Credential Types
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {CREDENTIAL_TYPES.slice(0, 6).map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'outline'}
                className='h-auto py-3 justify-start text-left flex flex-col items-start'
                onClick={() =>
                  setSelectedType(selectedType === type.id ? null : type.id)
                }
              >
                <span className='font-medium'>{type.name}</span>
                <span className='text-xs text-muted-foreground mt-1'>
                  {type.description}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Issuers List */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>Credential Issuers</h2>

          {filteredIssuers.length === 0 ? (
            <div className='text-center py-12 border border-dashed rounded-lg'>
              <Store className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>No issuers found</h3>
              <p className='text-muted-foreground mb-4'>
                Try adjusting your filters or search query
              </p>
              <Button
                variant='outline'
                onClick={() => {
                  setSearchQuery('')
                  setSelectedType(null)
                  setShowVerifiedOnly(false)
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredIssuers.map((issuer) => (
                <Card key={issuer.identity_id}>
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <CardTitle className='truncate max-w-[70%]'>
                        {issuer.identity_id}
                      </CardTitle>
                      <div className='flex items-center'>
                        <Star className='w-4 h-4 text-yellow-500 mr-1 fill-yellow-500' />
                        <span>{issuer.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <CardDescription className='flex items-center gap-1'>
                      {issuer.verified && (
                        <Badge variant='default' className='px-2 py-0'>
                          <Check className='w-3 h-3 mr-1' />
                          Verified
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='mb-4'>
                      <h4 className='text-sm font-medium mb-2'>
                        Credential Types
                      </h4>
                      <div className='flex flex-wrap gap-2'>
                        {issuer.credential_types.map((type) => (
                          <Badge key={type} variant='outline'>
                            {CREDENTIAL_TYPES.find((t) => t.id === type)
                              ?.name || type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className='text-sm font-medium mb-2'>Pricing</h4>
                      <div className='space-y-2'>
                        {Object.entries(issuer.fees).map(([type, fee]) => (
                          <div
                            key={type}
                            className='flex justify-between text-sm'
                          >
                            <span className='text-muted-foreground'>
                              {CREDENTIAL_TYPES.find((t) => t.id === type)
                                ?.name || type}
                              :
                            </span>
                            <span className='font-medium'>
                              {formatAndrPrice(fee)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className='w-full flex items-center justify-center gap-1'
                      disabled={!isConnected}
                    >
                      Request Credentials <ArrowRight className='w-4 h-4' />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
