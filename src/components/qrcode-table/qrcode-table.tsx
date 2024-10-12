'use client'

import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'

import { getTableLink } from '@/lib/client-utils'

interface QRCodeTableProps {
  tableNumber: number
  token: string
  width?: number
}

export default function QRCodeTable({ tableNumber, token, width = 250 }: QRCodeTableProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    canvas.height = width + 70
    canvas.width = width
    const canvasContext = canvas.getContext('2d')!
    canvasContext.fillStyle = '#fff'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.font = '20px Arial'
    canvasContext.textAlign = 'center'
    canvasContext.fillStyle = '#000'
    canvasContext.fillText(`Bàn số ${tableNumber}`, canvas.width / 2, canvas.width + 20)
    canvasContext.fillText('Quét mã QR để gọi món', canvas.width / 2, canvas.width + 50)

    const virtualCanvas = document.createElement('canvas')

    QRCode.toCanvas(
      virtualCanvas,
      getTableLink({
        tableNumber,
        token
      }),
      {
        width,
        margin: 4
      },
      function (error) {
        if (error) console.error(error)

        canvasContext.drawImage(virtualCanvas, 0, 0, width, width)
      }
    )
  }, [tableNumber, token, width])

  return <canvas ref={canvasRef} />
}
