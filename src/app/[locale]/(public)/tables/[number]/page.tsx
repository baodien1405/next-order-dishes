import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { GuestLoginForm } from '@/app/[locale]/(public)/tables/[number]/_components'
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
    namespace: 'LoginGuest'
  })
  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/tables/${params.number}`
  return {
    title: `No ${params.number} | ${t('title')}`,
    description: t('description'),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      title: `No ${params.number} | ${t('title')}`,
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

export default function TableNumberPage() {
  return <GuestLoginForm />
}
