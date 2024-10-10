import { envConfig } from '@/configs'

export const BASE_OPEN_GRAPH = {
  locale: 'en_US',
  alternateLocale: ['vi_VN'],
  type: 'website',
  siteName: 'Bigboy Restaurant',
  images: [
    {
      url: `${envConfig.NEXT_PUBLIC_URL}/banner.png`
    }
  ]
}
