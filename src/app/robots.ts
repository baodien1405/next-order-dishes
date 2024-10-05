import { envConfig } from '@/configs'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: `${envConfig.NEXT_PUBLIC_URL}/sitemap.xml`
  }
}
