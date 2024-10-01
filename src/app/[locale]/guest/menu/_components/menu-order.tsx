'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useDishListQuery, useGuestAddOrderMutation } from '@/hooks'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import { OrderQuantity } from '@/app/guest/menu/_components'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { DishStatus, path } from '@/constants'

export function MenuOrder() {
  const router = useRouter()
  const [orderList, setOrderList] = useState<GuestCreateOrdersBodyType>([])
  const guestAddOrderMutation = useGuestAddOrderMutation()
  const { data } = useDishListQuery()

  const dishes = useMemo(() => data?.payload?.data || [], [data?.payload?.data])
  const isDisabledOrderBtn = orderList.length === 0 || guestAddOrderMutation.isPending

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

  const handleOrder = async () => {
    if (guestAddOrderMutation.isPending) return

    try {
      await guestAddOrderMutation.mutateAsync(orderList)
      router.push(path.GUEST_ORDERS)
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn('flex gap-4', {
              'pointer-events-none': dish.status === DishStatus.Unavailable
            })}
          >
            <div className="flex-shrink-0 relative">
              {dish.status === DishStatus.Unavailable && (
                <span className="text-sm absolute inset-0 flex justify-center items-center">Hết hàng</span>
              )}
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
        <Button className="w-full justify-between" disabled={isDisabledOrderBtn} onClick={handleOrder}>
          <span>Đặt hàng · {orderList.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
