/**
 * ChainID Configuration
 *
 * This file contains the central configuration for the ChainID application.
 * Update these settings as needed for your environment.
 */

export const CHAINID_CONFIG = {
  // Application information
  app: {
    name: 'ChainID',
    version: '0.1.0',
    description: 'Decentralized Identity & Credential Verification System',
    url: {
      testnet: 'https://testnet.chainid.io',
      mainnet: 'https://chainid.io',
    },
  },

  // Default network settings
  network: {
    default: 'testnet' as const, // "testnet" or "mainnet"
    contracts: {
      testnet: {
        identityRegistry: 'andr1identity123456789abcdef',
        credentialFactory: 'andr1credential123456789abcdef',
        verificationController: 'andr1verification123456789abcdef',
        revocationRegistry: 'andr1revocation123456789abcdef',
        zkProofs: 'andr1zkproofs123456789abcdef',
        credentialMarketplace: 'andr1marketplace123456789abcdef',
      },
      mainnet: {
        identityRegistry: '',
        credentialFactory: '',
        verificationController: '',
        revocationRegistry: '',
        zkProofs: '',
        credentialMarketplace: '',
      },
    },
  },

  // Default credential types
  credentialTypes: [
    {
      id: 'EmailVerification',
      name: 'Email Verification',
      description: 'Verify email ownership',
      icon: 'mail',
    },
    {
      id: 'PhoneVerification',
      name: 'Phone Verification',
      description: 'Verify phone number ownership',
      icon: 'phone',
    },
    {
      id: 'BasicKYC',
      name: 'Basic KYC',
      description: 'Know Your Customer verification',
      icon: 'user-check',
    },
    {
      id: 'AgeVerification',
      name: 'Age Verification',
      description: 'Verify age (18+, 21+)',
      icon: 'calendar',
    },
    {
      id: 'AddressVerification',
      name: 'Address Verification',
      description: 'Verify physical address',
      icon: 'home',
    },
    {
      id: 'EducationCredential',
      name: 'Education Credential',
      description: 'Verify educational achievements',
      icon: 'graduation-cap',
    },
    {
      id: 'EmploymentVerification',
      name: 'Employment Verification',
      description: 'Verify employment status',
      icon: 'briefcase',
    },
    {
      id: 'IncomeVerification',
      name: 'Income Verification',
      description: 'Verify income level',
      icon: 'dollar-sign',
    },
    {
      id: 'CreditScore',
      name: 'Credit Score',
      description: 'Verify credit score range',
      icon: 'bar-chart',
    },
    {
      id: 'SocialMediaVerification',
      name: 'Social Media Verification',
      description: 'Verify social media account ownership',
      icon: 'instagram',
    },
    {
      id: 'WebsiteOwnership',
      name: 'Website Ownership',
      description: 'Verify website ownership',
      icon: 'globe',
    },
    {
      id: 'DomainVerification',
      name: 'Domain Verification',
      description: 'Verify domain ownership',
      icon: 'link',
    },
  ],

  // Default expiration options
  expirationOptions: [
    { days: 30, label: '1 Month' },
    { days: 90, label: '3 Months' },
    { days: 180, label: '6 Months' },
    { days: 365, label: '1 Year' },
    { days: 1095, label: '3 Years' },
    { days: 0, label: 'No Expiration' },
  ],

  // API endpoints
  api: {
    testnet: 'https://api.testnet.chainid.io',
    mainnet: 'https://api.chainid.io',
  } as const,

  // Feature flags
  features: {
    zkProofs: true,
    marketplaceEnabled: true,
    socialRecovery: true,
    biometricAuth: false,
  },
}

// Define network type
export type NetworkType = 'testnet' | 'mainnet'

// Helper functions to access configuration
export function getContractAddresses(network?: NetworkType) {
  const networkToUse =
    network || (CHAINID_CONFIG.network.default as NetworkType)
  return CHAINID_CONFIG.network.contracts[networkToUse]
}

export function getCredentialTypeInfo(typeId: string) {
  return CHAINID_CONFIG.credentialTypes.find((type) => type.id === typeId)
}

export function getApiUrl(network?: NetworkType) {
  const networkToUse =
    network || (CHAINID_CONFIG.network.default as NetworkType)
  return CHAINID_CONFIG.api[networkToUse]
}
