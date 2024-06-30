'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { path } from '@/constants'
import { useLogoutMutation } from '@/hooks'
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@/lib/common'

export default function Logout() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const logoutRequestRef = useRef<any>(null)
  const timeoutRef = useRef<any>(null)

  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const accessTokenFromUrl = searchParams.get('accessToken')

  const { mutateAsync } = useLogoutMutation()

  useEffect(() => {
    if (
      logoutRequestRef.current ||
      (refreshTokenFromUrl && refreshTokenFromUrl !== getRefreshTokenFromLS()) ||
      (accessTokenFromUrl && accessTokenFromUrl !== getAccessTokenFromLS())
    ) {
      return
    }

    logoutRequestRef.current = mutateAsync

    mutateAsync().then(() => {
      timeoutRef.current = setTimeout(() => {
        logoutRequestRef.current = null
      }, 1000)
      router.push(path.LOGIN)
    })

    return clearTimeout(timeoutRef.current)
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl])

  return <div>Logout...</div>
}