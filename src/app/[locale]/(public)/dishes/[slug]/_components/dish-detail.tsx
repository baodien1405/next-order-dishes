import Image from 'next/image'

import { formatCurrency } from '@/lib/utils'
import { DishResType } from '@/schemaValidations/dish.schema'

export async function DishDetail({ dish }: { dish?: DishResType['data'] }) {
  if (!dish) {
    return <h1 className="text-2xl lg:text-3xl font-semibold">Món ăn không tồn tại</h1>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-semibold flex">{dish.name}</h1>
      <div className="font-semibold">Giá: {formatCurrency(dish.price)}</div>
      <Image
        src={dish.image}
        width={700}
        height={700}
        quality={100}
        alt={dish.name}
        className="w-full h-full object-cover rounded-md max-w-[1080px] max-h-[1080px]"
        title={dish.name}
      />
      <div>{dish.description}</div>
    </div>
  )
}
