'use client'

import { useEffect } from 'react'

import { path } from '@/constants'
import { getRefreshTokenFromLS } from '@/lib/common'
import { checkAndRefreshToken } from '@/lib/client-utils'
import { useRouter } from '@/i18n/routing'
import { SearchParamsLoader, useSearchParamsLoader } from '@/components/search-params-loader'

export function RefreshToken() {
  const router = useRouter()
  const { searchParams, setSearchParams } = useSearchParamsLoader()
  const refreshTokenFromUrl = searchParams?.get('refreshToken')
  const redirectPath = searchParams?.get('redirect')

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

  return (
    <>
      <SearchParamsLoader onParamsReceived={setSearchParams} />
      <span>Refresh token...</span>
    </>
  )
}
