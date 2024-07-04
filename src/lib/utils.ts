import { type ClassValue, clsx } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { jwtDecode } from 'jwt-decode'

import { EntityError } from '@/lib/http'
import { toast } from '@/components/ui/use-toast'
import {
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  removeAccessTokenToLS,
  removeRefreshTokenToLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '@/lib/common'
import { authService } from '@/services'
import { DishStatus, TableStatus } from '@/constants'
import { envConfig } from '@/configs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000
    })
  }
}

export const checkAndRefreshToken = async (params?: { onSuccess?: () => void; onError?: () => void }) => {
  const accessToken = getAccessTokenFromLS()
  const refreshToken = getRefreshTokenFromLS()

  if (!accessToken || !refreshToken) return

  const decodeAccessToken = jwtDecode(accessToken) as { exp: number; iat: number }
  const decodeRefreshToken = jwtDecode(refreshToken) as { exp: number; iat: number }

  const now = Math.round(new Date().getTime() / 1000)

  const isExpiredRefreshToken = decodeRefreshToken.exp <= now

  if (isExpiredRefreshToken) {
    removeAccessTokenToLS()
    removeRefreshTokenToLS()

    if (params?.onError) {
      params.onError()
    }

    return
  }

  const remainingAccessTokenTime = decodeAccessToken.exp - now
  const validAccessTokenDuration = decodeAccessToken.exp - decodeAccessToken.iat

  if (remainingAccessTokenTime < validAccessTokenDuration / 3) {
    try {
      const response = await authService.refreshToken()

      const { accessToken, refreshToken } = response.payload.data

      setAccessTokenToLS(accessToken)
      setRefreshTokenToLS(refreshToken)

      if (params?.onSuccess) {
        params.onSuccess()
      }
    } catch (error) {
      if (params?.onError) {
        params.onError()
      }
    }
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return `${envConfig.NEXT_PUBLIC_URL}/tables/${tableNumber}?token=${token}`
}
