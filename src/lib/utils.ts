import { type ClassValue, clsx } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { jwtDecode } from 'jwt-decode'
import { format } from 'date-fns'
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react'

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
import { authService, guestService } from '@/services'
import { DishStatus, OrderStatus, Role, TableStatus } from '@/constants'
import { envConfig } from '@/configs'
import { TokenPayload } from '@/types'

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

  const decodeAccessToken = jwtDecode<TokenPayload>(accessToken)
  const decodeRefreshToken = jwtDecode<TokenPayload>(refreshToken)

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
      const role = decodeAccessToken.role
      const response = role === Role.Guest ? await guestService.refreshToken() : await authService.refreshToken()

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
  const dishStatusVN = {
    [DishStatus.Available]: 'Có sẵn',
    [DishStatus.Unavailable]: 'Không có sẵn',
    [DishStatus.Hidden]: 'Ẩn'
  } as const

  return dishStatusVN[status]
}

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  const orderStatusVN = {
    [OrderStatus.Paid]: 'Đã thanh toán',
    [OrderStatus.Delivered]: 'Đã phục vụ',
    [OrderStatus.Pending]: 'Chờ xử lý',
    [OrderStatus.Processing]: 'Đang nấu',
    [OrderStatus.Rejected]: 'Từ chối'
  } as const

  return orderStatusVN[status]
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  const tableStatusVN = {
    [TableStatus.Available]: 'Có sẵn',
    [TableStatus.Reserved]: 'Đã đặt',
    [TableStatus.Hidden]: 'Ẩn'
  } as const

  return tableStatusVN[status]
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return `${envConfig.NEXT_PUBLIC_URL}/tables/${tableNumber}?token=${token}`
}

export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins
}
