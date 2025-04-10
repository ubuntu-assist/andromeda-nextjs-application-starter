/**
 * Core ADO interfaces for ChainID system - Credential Factory
 */

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
