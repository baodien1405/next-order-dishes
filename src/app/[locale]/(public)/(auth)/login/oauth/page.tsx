import { Metadata } from 'next'

import { OAuth } from '@/app/[locale]/(public)/(auth)/login/oauth/_components'

export const metadata: Metadata = {
  title: 'Google Login Redirect',
  description: 'Google Login Redirect',
  robots: {
    index: false
  }
}

export default function OAuthPage() {
  return <OAuth />
}
