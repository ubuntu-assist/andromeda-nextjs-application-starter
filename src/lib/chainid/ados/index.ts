/**
 * Core ADO interfaces for ChainID system
 */

// IdentityRegistry ADO
export namespace IDENTITY_REGISTRY {
  export const createIdentityMsg = (
    owner: string,
    metadata?: Record<string, any>
  ) => {
    return {
      create_identity: {
        owner,
        metadata: metadata || {},
      },
    }
  }

  export const getIdentityMsg = (id: string) => {
    return {
      get_identity: {
        id,
      },
    }
  }

  export const getIdentityByOwnerMsg = (owner: string) => {
    return {
      get_identity_by_owner: {
        owner,
      },
    }
  }

  export interface Identity {
    id: string
    owner: string
    created_at: number
    updated_at: number
    metadata: Record<string, any>
    active: boolean
  }

  export type GetIdentityResponse = Identity
}

// CredentialFactory ADO
export namespace CREDENTIAL_FACTORY {
  export const issueCredentialMsg = (
    recipient_id: string,
    credential_type: string,
    claims: Record<string, any>,
    expiration?: number
  ) => {
    return {
      issue_credential: {
        recipient_id,
        credential_type,
        claims,
        expiration,
      },
    }
  }

  export const getCredentialMsg = (id: string) => {
    return {
      get_credential: {
        id,
      },
    }
  }

  export const getCredentialsByRecipientMsg = (recipient_id: string) => {
    return {
      get_credentials_by_recipient: {
        recipient_id,
      },
    }
  }

  export interface Credential {
    id: string
    issuer: string
    recipient_id: string
    credential_type: string
    claims: Record<string, any>
    issued_at: number
    expiration?: number
    revoked: boolean
  }

  export type GetCredentialResponse = Credential
  export type GetCredentialsByRecipientResponse = Credential[]
}

// RevocationRegistry ADO
export namespace REVOCATION_REGISTRY {
  export const revokeCredentialMsg = (
    credential_id: string,
    reason?: string
  ) => {
    return {
      revoke_credential: {
        credential_id,
        reason,
      },
    }
  }

  export const isRevokedMsg = (credential_id: string) => {
    return {
      is_revoked: {
        credential_id,
      },
    }
  }

  export type IsRevokedResponse = {
    revoked: boolean
    reason?: string
    revoked_at?: number
  }
}

// VerificationController ADO
export namespace VERIFICATION_CONTROLLER {
  export const verifyCredentialMsg = (credential_id: string) => {
    return {
      verify_credential: {
        credential_id,
      },
    }
  }

  export const verifyClaimMsg = (
    credential_id: string,
    claim_key: string,
    expected_value: any
  ) => {
    return {
      verify_claim: {
        credential_id,
        claim_key,
        expected_value,
      },
    }
  }

  export type VerifyCredentialResponse = {
    valid: boolean
    expired: boolean
    revoked: boolean
  }

  export type VerifyClaimResponse = {
    valid: boolean
    message?: string
  }
}

// ZKProofs ADO
export namespace ZK_PROOFS {
  export const generateProofMsg = (
    credential_id: string,
    claim_keys: string[]
  ) => {
    return {
      generate_proof: {
        credential_id,
        claim_keys,
      },
    }
  }

  export const verifyProofMsg = (proof: string, public_inputs: any) => {
    return {
      verify_proof: {
        proof,
        public_inputs,
      },
    }
  }

  export type GenerateProofResponse = {
    proof: string
    public_inputs: any
  }

  export type VerifyProofResponse = {
    valid: boolean
  }
}

// CredentialMarketplace ADO
export namespace CREDENTIAL_MARKETPLACE {
  export const registerIssuerMsg = (
    identity_id: string,
    credential_types: string[],
    fees: Record<string, string>
  ) => {
    return {
      register_issuer: {
        identity_id,
        credential_types,
        fees,
      },
    }
  }

  export const getIssuersMsg = (credential_type?: string) => {
    return {
      get_issuers: {
        credential_type,
      },
    }
  }

  export interface IssuerInfo {
    identity_id: string
    credential_types: string[]
    fees: Record<string, string>
    rating: number
    verified: boolean
  }

  export type GetIssuersResponse = IssuerInfo[]
}

export * from './identity-registry'
export * from './credential-factory'
export * from './verification-controller'
export * from './revocation-registry'
export * from './zk-proofs'
export * from './credential-marketplace'
