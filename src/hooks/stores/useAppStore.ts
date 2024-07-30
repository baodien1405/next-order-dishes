import { create } from 'zustand'
import type { Socket } from 'socket.io-client'

import { RoleType } from '@/types'
import { removeAccessTokenToLS, removeRefreshTokenToLS } from '@/lib/common'

interface AppStoreInterface {
  isAuth: boolean
  role?: RoleType
  setRole: (role?: RoleType) => void
  socket?: Socket
  setSocket: (socket?: Socket) => void
  disconnectSocket: () => void
}

export const useAppStore = create<AppStoreInterface>((set, get) => ({
  isAuth: Boolean(get()?.role),
  role: undefined,
  setRole: (role?: RoleType) => {
    set({ role })
    if (!role) {
      removeAccessTokenToLS()
      removeRefreshTokenToLS()
    }
  },
  socket: undefined,
  setSocket: (socket?: Socket) => set({ socket }),
  disconnectSocket: () =>
    set((state) => {
      state.socket?.disconnect()
      return { socket: undefined }
    })
}))
