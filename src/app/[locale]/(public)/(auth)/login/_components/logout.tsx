'use client'

import { useEffect, useRef, memo } from 'react'

import { path } from '@/constants'
import { useAppStore, useLogoutMutation } from '@/hooks'
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@/lib/common'
import { useRouter } from '@/i18n/routing'
import { SearchParamsLoader, useSearchParamsLoader } from '@/components/search-params-loader'

function LogoutInner() {
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
      })
    } else if (accessTokenFromUrl !== getAccessTokenFromLS()) {
      router.push(path.HOME)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole, disconnectSocket])

  return <SearchParamsLoader onParamsReceived={setSearchParams} />
}

export const Logout = memo(LogoutInner)
