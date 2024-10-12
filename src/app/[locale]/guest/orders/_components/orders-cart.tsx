'use client'

import { useEffect, useMemo } from 'react'
import Image from 'next/image'

import { useAppStore, useGuestGetOrderListQuery } from '@/hooks'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/client-utils'
import { Badge } from '@/components/ui/badge'
import { PayGuestOrdersResType, UpdateOrderResType } from '@/schemaValidations/order.schema'
import { useToast } from '@/components/ui/use-toast'
import { OrderStatus } from '@/constants'

export function OrdersCart() {
  const toast = useToast()
  const socket = useAppStore((state) => state.socket)
  const { data, refetch } = useGuestGetOrderListQuery()
  const orderList = useMemo(() => data?.payload.data || [], [data?.payload.data])

  const { unpaid, paid } = useMemo(() => {
    return orderList.reduce(
      (result, dish) => {
        const unpaidStatusList: string[] = [OrderStatus.Pending, OrderStatus.Processing, OrderStatus.Delivered]

        if (unpaidStatusList.includes(dish.status)) {
          return {
            ...result,
            unpaid: {
              price: result.unpaid.price + dish.dishSnapshot.price * dish.quantity,
              quantity: result.unpaid.quantity + dish.quantity
            }
          }
        }

        if (dish.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price: result.paid.price + dish.dishSnapshot.price * dish.quantity,
              quantity: result.paid.quantity + dish.quantity
            }
          }
        }

        return result
      },
      {
        unpaid: {
          price: 0,
          quantity: 0
        },
        paid: {
          price: 0,
          quantity: 0
        }
      }
    )
  }, [orderList])

  useEffect(() => {
    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket?.id)
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

    function onPayment(data: PayGuestOrdersResType['data']) {
      const { guest } = data[0]

      toast.toast({
        description: `${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn`
      })

      refetch()
    }

    socket?.on('update-order', onOrderUpdate)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)
    socket?.on('payment', onPayment)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('update-order', onOrderUpdate)
      socket?.off('payment', onPayment)
    }
  }, [refetch, toast, socket])

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

      {paid.price !== 0 && (
        <div className="sticky bottom-0">
          <div className="w-full flex space-x-4 text-xl font-semibold">
            <span>Đã thanh toán · {paid.quantity} món</span>
            <span>{formatCurrency(paid.price)}</span>
          </div>
        </div>
      )}

      <div className="sticky bottom-0">
        <div className="w-full flex space-x-4 text-xl font-semibold">
          <span>Chưa thanh toán · {unpaid.quantity} món</span>
          <span>{formatCurrency(unpaid.price)}</span>
        </div>
      </div>
    </>
  )
}
