/**
 * Core ADO interfaces for ChainID system - Identity Registry
 */

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
