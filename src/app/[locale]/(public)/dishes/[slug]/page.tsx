import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { cache } from 'react'

import { DishDetail } from '@/app/[locale]/(public)/dishes/[slug]/_components'
import { envConfig } from '@/configs'
import { Locale } from '@/i18n/config'
import { generateSlugUrl, getIdFromSlugUrl, wrapServerApi } from '@/lib/utils'
import { dishService } from '@/services'
import { BASE_OPEN_GRAPH } from '@/shared-metadata'

const getDetail = cache((id: number) => wrapServerApi(() => dishService.get(id)))

type Props = {
  params: { slug: string; locale: Locale }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'DishDetail'
  })
  const id = getIdFromSlugUrl(params.slug)
  const data = await getDetail(id)
  const dish = data?.payload.data
  if (!dish) {
    return {
      title: t('not_found'),
      description: t('not_found')
    }
  }
  const url =
    envConfig.NEXT_PUBLIC_URL +
    `/${params.locale}/dishes/${generateSlugUrl({
      name: dish.name,
      id: dish.id
    })}`
  return {
    title: dish.name,
    description: dish.description,
    openGraph: {
      ...BASE_OPEN_GRAPH,
      title: dish.name,
      description: dish.description,
      url,
      images: [
        {
          url: dish.image
        }
      ]
    },
    alternates: {
      canonical: url
    }
  }
}

export default async function DishDetailPage({ params }: { params: { slug: string } }) {
  const id = getIdFromSlugUrl(params.slug)
  const t = await getTranslations('DishDetail')
  const data = await getDetail(id)
  const dish = data?.payload?.data

  if (!dish) {
    return <h1 className="text-2xl lg:text-3xl font-semibold">{t('not_found')}</h1>
  }

  return <DishDetail dish={dish} />
}
