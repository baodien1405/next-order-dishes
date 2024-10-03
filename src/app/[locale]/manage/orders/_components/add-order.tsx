'use client'

import Image from 'next/image'
import { Loader2, PlusCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { GetListGuestsResType } from '@/schemaValidations/account.schema'
import { Switch } from '@/components/ui/switch'

import { CreateOrdersBodyType } from '@/schemaValidations/order.schema'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'

import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import { DishStatus } from '@/constants/type'
import { useAddOrderMutation, useCreateGuestMutation, useDishListQuery } from '@/hooks'
import { useToast } from '@/components/ui/use-toast'
import { TablesDialog } from '@/app/[locale]/manage/orders/_components/tables-dialog'
import { GuestsDialog } from '@/app/[locale]/manage/orders/_components/guests-dialog'
import { OrderQuantity } from '@/app/[locale]/guest/menu/_components'

export function AddOrder() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<GetListGuestsResType['data'][0] | null>(null)
  const [isNewGuest, setIsNewGuest] = useState(true)
  const [orders, setOrders] = useState<CreateOrdersBodyType['orders']>([])
  const addOrderMutation = useAddOrderMutation()
  const createGuestMutation = useCreateGuestMutation()
  const { data } = useDishListQuery()
  const dishes = useMemo(() => data?.payload.data || [], [data?.payload.data])
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id)
      if (!order) return result
      return result + order.quantity * dish.price
    }, 0)
  }, [dishes, orders])

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      tableNumber: 0
    }
  })
  const name = form.watch('name')
  const tableNumber = form.watch('tableNumber')

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId)
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }]
      }
      const newOrders = [...prevOrders]
      newOrders[index] = { ...newOrders[index], quantity }
      return newOrders
    })
  }

  const handleOrder = async () => {
    if (addOrderMutation.isPending) return
    try {
      let guestId = selectedGuest?.id

      if (isNewGuest) {
        const response = await createGuestMutation.mutateAsync({
          name,
          tableNumber
        })

        guestId = response.payload.data.id
      }

      if (!guestId) {
        toast.toast({
          description: 'Vui lòng chọn khách'
        })

        return
      }

      const response = await addOrderMutation.mutateAsync({
        guestId,
        orders
      })

      toast.toast({
        description: response.payload.message
      })

      reset()
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  const reset = () => {
    form.reset()
    setOrders([])
    setSelectedGuest(null)
    setIsNewGuest(false)
    setOpen(false)
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tạo đơn hàng</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Tạo đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
          <Label htmlFor="isNewGuest">Khách hàng mới</Label>
          <div className="col-span-3 flex items-center">
            <Switch id="isNewGuest" checked={isNewGuest} onCheckedChange={setIsNewGuest} />
          </div>
        </div>
        {isNewGuest && (
          <Form {...form}>
            <form noValidate className="grid auto-rows-max items-start gap-4 md:gap-8" id="add-employee-form">
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="name">Tên khách hàng</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="name" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tableNumber"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="tableNumber">Chọn bàn</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <div className="flex items-center gap-4">
                            <div>{field.value}</div>
                            <TablesDialog
                              onChoose={(table) => {
                                field.onChange(table.number)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}
        {!isNewGuest && (
          <GuestsDialog
            onChoose={(guest) => {
              setSelectedGuest(guest)
            }}
          />
        )}
        {!isNewGuest && selectedGuest && (
          <div className="grid grid-cols-4 items-center justify-items-start gap-4">
            <Label htmlFor="selectedGuest">Khách đã chọn</Label>
            <div className="col-span-3 w-full gap-4 flex items-center">
              <div>
                {selectedGuest.name} (#{selectedGuest.id})
              </div>
              <div>Bàn: {selectedGuest.tableNumber}</div>
            </div>
          </div>
        )}
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
                  <span className="absolute inset-0 flex items-center justify-center text-sm">Hết hàng</span>
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
                  onChange={(value) => handleQuantityChange(dish.id, value)}
                  value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
                />
              </div>
            </div>
          ))}
        <DialogFooter>
          <Button
            className="w-full justify-between"
            onClick={handleOrder}
            disabled={orders.length === 0 || addOrderMutation.isPending}
          >
            {addOrderMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Đặt hàng · {orders.length} món</span>
                <span>{formatCurrency(totalPrice)}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
