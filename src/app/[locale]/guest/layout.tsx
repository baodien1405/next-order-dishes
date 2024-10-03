import { ReactNode } from 'react'

import Layout from '@/app/[locale]/(public)/layout'

export default function GuestLayout({ children }: { children: ReactNode }) {
  return <Layout modal={null}>{children}</Layout>
}
