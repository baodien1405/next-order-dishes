'use client'

import { useEffect, useMemo } from 'react'
import Image from 'next/image'

import { useGuestGetOrderListQuery } from '@/hooks'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { socket } from '@/lib/socket'
import { UpdateOrderResType } from '@/schemaValidations/order.schema'
import { useToast } from '@/components/ui/use-toast'

export function OrdersCart() {
  const toast = useToast()
  const { data, refetch } = useGuestGetOrderListQuery()
  const orderList = data?.payload.data || []

  const totalPrice = useMemo(() => {
    return orderList.reduce((price, dish) => {
      return price + dish.dishSnapshot.price * dish.quantity
    }, 0)
  }, [orderList])

  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket.id)
    }

    function onDisconnect() {
      console.log('disconnected')
    }

    function onOrderUpdate(data: UpdateOrderResType['data']) {
      const {
        dishSnapshot: { name },
        quantity,
        status
      } = data

      toast.toast({
        description: `Món ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(
          status
        )}`
      })

      refetch()
    }

    socket.on('update-order', onOrderUpdate)
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('update-order', onOrderUpdate)
    }
  }, [])

  return (
    <>
      {orderList.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="text-sm font-semibold flex justify-center items-center">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold">
              <span>{formatCurrency(order.dishSnapshot.price)}</span>
              <span className="mx-1">x</span>
              <Badge className="px-1">{order.quantity}</Badge>
            </div>
          </div>

          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant="outline">{getVietnameseOrderStatus(order.status)}</Badge>
          </div>
        </div>
      ))}

      <div className="sticky bottom-0">
        <div className="w-full flex space-x-4 text-xl font-semibold">
          <span>Tổng cộng · {orderList.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>
  )
}
