import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'

import { LoginForm } from '@/app/[locale]/(public)/(auth)/login/_components'
import { Locale } from '@/i18n/config'
import { envConfig } from '@/configs'
import { path } from '@/constants'

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'LoginPage' })
  const url = `${envConfig.NEXT_PUBLIC_URL}/${locale}${path.LOGIN}`

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: url
    }
  }
}

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale)

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  )
}
