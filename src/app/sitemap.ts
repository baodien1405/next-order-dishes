import type { MetadataRoute } from 'next'

import { envConfig } from '@/configs'
import { locales } from '@/i18n/config'
import { generateSlugUrl } from '@/lib/client-utils'
import { dishService } from '@/services'
import { path } from '@/constants'

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: path.HOME,
    changeFrequency: 'daily',
    priority: 1
  },
  {
    url: path.LOGIN,
    changeFrequency: 'yearly',
    priority: 0.5
  }
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await dishService.getAll()
  const dishList = result.payload.data || []

  const localizeStaticSiteMap = locales.reduce((acc, locale) => {
    return [
      ...acc,
      ...staticRoutes.map((route) => {
        return {
          ...route,
          url: `${envConfig.NEXT_PUBLIC_URL}/${locale}${route.url}`,
          lastModified: new Date()
        }
      })
    ]
  }, [] as MetadataRoute.Sitemap)

  const localizeDishSiteMap = locales.reduce((acc, locale) => {
    const dishListSiteMap: MetadataRoute.Sitemap = dishList.map((dish) => {
      return {
        url: `${envConfig.NEXT_PUBLIC_URL}/${locale}/dishes/${generateSlugUrl({
          id: dish.id,
          name: dish.name
        })}`,
        lastModified: dish.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9
      }
    })
    return [...acc, ...dishListSiteMap]
  }, [] as MetadataRoute.Sitemap)

  return [...localizeStaticSiteMap, ...localizeDishSiteMap]
}
