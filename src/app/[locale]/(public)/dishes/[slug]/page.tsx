import { DishDetail } from '@/app/[locale]/(public)/dishes/[slug]/_components'
import { generateSlugUrl, getSlugIdFromSlugUrl, wrapServerApi } from '@/lib/utils'
import { dishService } from '@/services'

export async function generateStaticParams() {
  const response = await wrapServerApi(() => dishService.getAll())
  const dishList = response?.payload.data || []

  return dishList.map((dish) => ({
    slug: generateSlugUrl({
      name: dish.name,
      id: dish.id
    })
  }))
}

export default async function DishDetailPage({ params }: { params: { slug: string } }) {
  const slugId = getSlugIdFromSlugUrl(params.slug)
  const data = await wrapServerApi(() => dishService.get(slugId))
  const dish = data?.payload?.data

  if (!dish) {
    return <h1 className="text-2xl lg:text-3xl font-semibold">Món ăn không tồn tại</h1>
  }

  return <DishDetail dish={dish} />
}
