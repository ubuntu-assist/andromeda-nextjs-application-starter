/**
 * Core ADO interfaces for ChainID system - Credential Marketplace
 */

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
