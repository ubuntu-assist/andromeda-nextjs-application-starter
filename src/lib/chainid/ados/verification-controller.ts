/**
 * Core ADO interfaces for ChainID system - Verification Controller
 */

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
