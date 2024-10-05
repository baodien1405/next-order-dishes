import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { MenuOrder } from '@/app/[locale]/guest/menu/_components'
import { envConfig } from '@/configs'
import { Locale } from '@/i18n/config'
import { BASE_OPEN_GRAPH } from '@/shared-metadata'

type Props = {
  params: { number: string; locale: Locale }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'GuestMenu'
  })
  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/guest/menu`
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      title: t('title'),
      description: t('description'),
      url
    },
    alternates: {
      canonical: url
    },
    robots: {
      index: false
    }
  }
}

export default async function MenuPage() {
  return (
    <div className="max-w-[400px] mx-auto space-y-4">
      <h1 className="text-center text-xl font-bold">🍕 Menu quán</h1>
      <MenuOrder />
    </div>
  )
}
