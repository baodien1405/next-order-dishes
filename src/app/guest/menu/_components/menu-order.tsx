'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useDishListQuery } from '@/hooks'
import { formatCurrency } from '@/lib/utils'
import { OrderQuantity } from '@/app/guest/menu/_components'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'

export function MenuOrder() {
  const [orderList, setOrderList] = useState<GuestCreateOrdersBodyType>([])
  const { data } = useDishListQuery()
  const dishes = data?.payload?.data || []
  const totalPrice = useMemo(() => {
    return dishes.reduce((price, dish) => {
      const order = orderList.find((order) => order.dishId === dish.id)
      if (!order) return price

      return price + dish.price * order.quantity
    }, 0)
  }, [dishes, orderList])

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrderList((prevOrderList) => {
      if (quantity === 0) {
        return prevOrderList.filter((order) => order.dishId !== dishId)
      }

      const orderIndex = prevOrderList.findIndex((order) => order.dishId === dishId)

      if (orderIndex === -1) {
        return [...prevOrderList, { dishId, quantity }]
      }

      const newOrderList = [...prevOrderList]
      newOrderList[orderIndex] = { ...newOrderList[orderIndex], quantity }

      return newOrderList
    })
  }

  return (
    <>
      {dishes.map((dish) => (
        <div key={dish.id} className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src={dish.image}
              alt={dish.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{dish.name}</h3>
            <p className="text-xs">{dish.description}</p>
            <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <OrderQuantity
              value={orderList.find((order) => order.dishId === dish.id)?.quantity ?? 0}
              onChange={(value) => handleQuantityChange(dish.id, value)}
            />
          </div>
        </div>
      ))}

      <div className="sticky bottom-0">
        <Button className="w-full justify-between">
          <span>Giỏ hàng · {orderList.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
