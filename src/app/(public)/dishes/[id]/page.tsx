import Image from 'next/image'

import { formatCurrency, wrapServerApi } from '@/lib/utils'
import { dishService } from '@/services'

export default async function DishDetailPage({ params }: { params: { id: string } }) {
  const data = await wrapServerApi(() => dishService.get(Number(params.id)))
  const dish = data?.payload?.data

  if (!dish) {
    return <h1 className="text-2xl lg:text-3xl font-semibold">Món ăn không tồn tại</h1>
  }

  return (
    <div className="space-y-4">
      <div className="text-gray-700 shadow-md p-3 border-gray-300 ml-4 h-24 flex border-2"></div>

      <h1 className="text-2xl lg:text-3xl font-semibold flex">{dish.name}</h1>

      <div className="font-semibold">Giá: {formatCurrency(dish.price)}</div>

      <Image
        src={dish.image}
        width={700}
        height={700}
        quality={100}
        alt={dish.name}
        className="w-full h-full object-cover rounded-md max-w-[1080px] max-h-[1080px]"
      />

      <div>{dish.description}</div>
    </div>
  )
}
