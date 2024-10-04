'use client'

import { useEffect, useRef } from 'react'

import { path } from '@/constants'
import { useAppStore, useLogoutMutation } from '@/hooks'
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@/lib/common'
import { useRouter } from '@/i18n/routing'
import { SearchParamsLoader, useSearchParamsLoader } from '@/components/search-params-loader'

export default function LogoutPage() {
  const router = useRouter()
  const { searchParams, setSearchParams } = useSearchParamsLoader()
  const logoutRequestRef = useRef<any>(null)
  const timeoutRef = useRef<any>(null)

  const refreshTokenFromUrl = searchParams?.get('refreshToken')
  const accessTokenFromUrl = searchParams?.get('accessToken')

  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)
  const { mutateAsync } = useLogoutMutation()

  useEffect(() => {
    if (
      !logoutRequestRef.current &&
      ((refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLS()) ||
        (accessTokenFromUrl && accessTokenFromUrl === getAccessTokenFromLS()))
    ) {
      logoutRequestRef.current = mutateAsync

      mutateAsync().then(() => {
        timeoutRef.current = setTimeout(() => {
          logoutRequestRef.current = null
        }, 1000)

        setRole(undefined)
        disconnectSocket()
        router.push(path.LOGIN)
      })
    } else {
      router.push(path.HOME)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole, disconnectSocket])

  return (
    <div>
      <SearchParamsLoader onParamsReceived={setSearchParams} />
      <span>Logout...</span>
    </div>
  )
}
