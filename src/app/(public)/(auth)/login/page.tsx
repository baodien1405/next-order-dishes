import { Suspense } from 'react'

import { LoginForm } from '@/app/(public)/(auth)/login/_components'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
