'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { path } from '@/constants'
import { useLogoutMutation } from '@/hooks'
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@/lib/common'
import { useAppContext } from '@/providers'

export default function LogoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const logoutRequestRef = useRef<any>(null)
  const timeoutRef = useRef<any>(null)

  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const accessTokenFromUrl = searchParams.get('accessToken')

  const { setIsAuth } = useAppContext()
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
        setIsAuth(false)
        router.push(path.LOGIN)
      })
    } else {
      router.push(path.HOME)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setIsAuth])

  return <div>Logout...</div>
}
