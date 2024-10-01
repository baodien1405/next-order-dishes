import { ReactNode } from 'react'

import Layout from '@/app/(public)/layout'

export default function GuestLayout({ children }: { children: ReactNode }) {
  return <Layout modal={null}>{children}</Layout>
}
