import { DishDetail } from '@/app/(public)/dishes/[id]/_components'
import { wrapServerApi } from '@/lib/utils'
import { dishService } from '@/services'

export default async function DishDetailPage({ params }: { params: { id: string } }) {
  const data = await wrapServerApi(() => dishService.get(Number(params.id)))
  const dish = data?.payload?.data

  if (!dish) {
    return <h1 className="text-2xl lg:text-3xl font-semibold">Món ăn không tồn tại</h1>
  }

  return <DishDetail dish={dish} />
}
