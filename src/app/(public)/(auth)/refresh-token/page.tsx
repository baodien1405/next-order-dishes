'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { path } from '@/constants'
import { getRefreshTokenFromLS } from '@/lib/common'
import { checkAndRefreshToken } from '@/lib/utils'

export default function RefreshTokenPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const redirectPath = searchParams.get('redirect')

  useEffect(() => {
    if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLS()) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPath || path.HOME)
        }
      })
    } else {
      router.push(path.HOME)
    }
  }, [redirectPath, refreshTokenFromUrl, router])

  return <div>Refresh token ...</div>
}
