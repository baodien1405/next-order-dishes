import { Modal } from '@/app/[locale]/(public)/@modal/(.)dishes/[slug]/_components'
import { DishDetail } from '@/app/[locale]/(public)/dishes/[slug]/_components'
import { getIdFromSlugUrl, wrapServerApi } from '@/lib/client-utils'
import { dishService } from '@/services'

export default async function DishDetailPage({ params }: { params: { slug: string } }) {
  const slugId = getIdFromSlugUrl(params.slug)
  const data = await wrapServerApi(() => dishService.get(slugId))
  const dish = data?.payload?.data

  if (!dish) {
    return <h1 className="text-2xl lg:text-3xl font-semibold">Món ăn không tồn tại</h1>
  }

  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  )
}
