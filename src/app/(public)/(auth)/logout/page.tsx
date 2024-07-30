'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

import { path } from '@/constants'
import { useAppStore, useLogoutMutation } from '@/hooks'
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@/lib/common'

function Logout() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const logoutRequestRef = useRef<any>(null)
  const timeoutRef = useRef<any>(null)

  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const accessTokenFromUrl = searchParams.get('accessToken')

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

  return <div>Logout...</div>
}

export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  )
}
