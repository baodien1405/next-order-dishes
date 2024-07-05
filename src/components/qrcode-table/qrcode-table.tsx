'use client'

import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'

import { getTableLink } from '@/lib/utils'

interface QRCodeTableProps {
  tableNumber: number
  token: string
}

export default function QRCodeTable({ tableNumber, token }: QRCodeTableProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    QRCode.toCanvas(
      canvas,
      getTableLink({
        tableNumber,
        token
      }),
      function (error) {
        if (error) console.error(error)
      }
    )
  }, [tableNumber, token])

  return <canvas ref={canvasRef} />
}
