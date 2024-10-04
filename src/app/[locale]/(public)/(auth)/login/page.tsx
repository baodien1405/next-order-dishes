import { unstable_setRequestLocale } from 'next-intl/server'

import { LoginForm } from '@/app/[locale]/(public)/(auth)/login/_components'

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale)

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  )
}
