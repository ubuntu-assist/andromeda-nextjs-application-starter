import React, { useState, useEffect } from 'react'
import { ChainIDVerifier, CredentialVerificationRequest } from './index'

interface ChainIDQRCodeProps {
  verifier: ChainIDVerifier
  request: CredentialVerificationRequest
  width?: number
  height?: number
  onGenerate?: (data: {
    requestId: string
    qrCodeData: string
    deepLink: string
  }) => void
}

/**
 * A React component that displays a QR code for ChainID verification
 */
export function ChainIDQRCode({
  verifier,
  request,
  width = 250,
  height = 250,
  onGenerate,
}: ChainIDQRCodeProps) {
  const [qrData, setQrData] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function generateQR() {
      try {
        setLoading(true)
        const result = await verifier.requestCredential(request)
        setQrData(result.qrCodeData)
        setRequestId(result.requestId)
        if (onGenerate) {
          onGenerate(result)
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to generate QR code'
        )
      } finally {
        setLoading(false)
      }
    }

    generateQR()
  }, [verifier, request, onGenerate])

  if (loading) {
    return <div>Generating verification QR code...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!qrData) {
    return <div>No QR data available</div>
  }

  // In reality, we would render a QR code using a library like qrcode.react
  // For this demo, we're just showing a placeholder
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div>Scan to verify</div>
        <div style={{ fontSize: '10px', marginTop: '8px' }}>
          Request ID: {requestId}
        </div>
      </div>
    </div>
  )
}

/**
 * React hook for interacting with the ChainID system
 */
export function useChainID(config: {
  appId: string
  network: 'mainnet' | 'testnet'
}) {
  const [verifier, setVerifier] = useState<ChainIDVerifier | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const chainIDVerifier = new ChainIDVerifier({
        appId: config.appId,
        network: config.network,
      })
      setVerifier(chainIDVerifier)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to initialize ChainID'
      )
    } finally {
      setLoading(false)
    }
  }, [config.appId, config.network])

  return { verifier, loading, error }
}
