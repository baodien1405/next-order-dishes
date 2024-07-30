'use client'

import { jwtDecode } from 'jwt-decode'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { TokenPayload } from '@/types'
import { generateSocketInstance } from '@/lib/utils'
import { path } from '@/constants'
import { useToast } from '@/components/ui/use-toast'
import { useAppStore, useSetTokenToCookieMutation } from '@/hooks'

export default function OAuthPage() {
  const router = useRouter()
  const toast = useToast()
  const { mutateAsync } = useSetTokenToCookieMutation()
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const countRef = useRef(0)
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('accessToken')
  const refreshToken = searchParams.get('refreshToken')
  const message = searchParams.get('message')

  useEffect(() => {
    if (accessToken && refreshToken) {
      if (countRef.current === 0) {
        const { role } = jwtDecode<TokenPayload>(accessToken)

        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            setRole(role)
            setSocket(generateSocketInstance(accessToken))
            router.push(path.MANAGE_DASHBOARD)
          })
          .catch((error) => {
            toast.toast({ description: error.message || 'Có lỗi xảy ra' })
          })

        countRef.current++
      }
    } else {
      if (countRef.current === 0) {
        setTimeout(() => {
          toast.toast({ description: message || 'Có lỗi xảy ra' })
        })
      }
      countRef.current++
    }
  }, [accessToken, refreshToken, setRole, setSocket, router, toast, message, mutateAsync])

  return null
}
