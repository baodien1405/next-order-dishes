import { ReactNode, Suspense } from 'react'

export default function OAuthLayout({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>
}
