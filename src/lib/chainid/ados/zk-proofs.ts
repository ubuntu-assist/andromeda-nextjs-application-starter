/**
 * Core ADO interfaces for ChainID system - Zero-Knowledge Proofs
 */

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
