import { DishDetail } from '@/app/[locale]/(public)/dishes/[slug]/_components'
import { getSlugIdFromSlugUrl, wrapServerApi } from '@/lib/utils'
import { dishService } from '@/services'

export default async function DishDetailPage({ params }: { params: { slug: string } }) {
  const slugId = getSlugIdFromSlugUrl(params.slug)
  const data = await wrapServerApi(() => dishService.get(slugId))
  const dish = data?.payload?.data

  if (!dish) {
    return <h1 className="text-2xl lg:text-3xl font-semibold">Món ăn không tồn tại</h1>
  }

  return <DishDetail dish={dish} />
}
