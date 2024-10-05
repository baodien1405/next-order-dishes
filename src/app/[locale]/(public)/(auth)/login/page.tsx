import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'

import { LoginForm } from '@/app/[locale]/(public)/(auth)/login/_components'
import { Locale } from '@/i18n/config'

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'LoginPage' })
  return {
    title: t('title'),
    description: t('description')
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
