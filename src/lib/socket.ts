'use client'

import { io } from 'socket.io-client'

import { envConfig } from '@/configs'
import { getAccessTokenFromLS } from '@/lib/common'

export const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLS()}`
  }
})
