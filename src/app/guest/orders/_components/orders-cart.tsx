'use client'

import { useMemo } from 'react'
import Image from 'next/image'

import { useGuestGetOrderListQuery } from '@/hooks'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function OrdersCart() {
  const { data } = useGuestGetOrderListQuery()
  const orderList = data?.payload.data || []

  const totalPrice = useMemo(() => {
    return orderList.reduce((price, dish) => {
      return price + dish.dishSnapshot.price * dish.quantity
    }, 0)
  }, [orderList])

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
