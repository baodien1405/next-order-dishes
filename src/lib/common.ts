import { isClient } from '@/lib/http'

export const getAccessTokenFromLS = () => (isClient ? localStorage.getItem('accessToken') : null)

export const setAccessTokenToLS = (accessToken: string) => {
  if (isClient) {
    localStorage.setItem('accessToken', accessToken)
  }
}

export const removeAccessTokenToLS = () => {
  localStorage.removeItem('accessToken')
}

export const getRefreshTokenFromLS = () => (isClient ? localStorage.getItem('refreshToken') : null)

export const setRefreshTokenToLS = (refreshToken: string) => {
  if (isClient) {
    localStorage.setItem('refreshToken', refreshToken)
  }
}

export const removeRefreshTokenToLS = () => {
  localStorage.removeItem('refreshToken')
}

export const getUserFromLS = () => localStorage.getItem('user')

export const setUserToLS = (user: any) => {
  if (isClient) {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export const removeUserToLS = () => {
  localStorage.removeItem('user')
}
