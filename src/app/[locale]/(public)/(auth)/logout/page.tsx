import { Logout } from '@/app/[locale]/(public)/(auth)/logout/_components'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logout Redirect',
  description: 'Logout Redirect',
  robots: {
    index: false
  }
}

export default function LogoutPage() {
  return <Logout />
}
