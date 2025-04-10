/**
 * Core ADO interfaces for ChainID system - Revocation Registry
 */

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
