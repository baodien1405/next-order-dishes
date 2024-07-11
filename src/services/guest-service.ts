import { http } from '@/lib/http'
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from '@/schemaValidations/auth.schema'
import { GuestLoginBodyType, GuestLoginResType } from '@/schemaValidations/guest.schema'

export const guestService = {
  refreshTokenRequest: null as Promise<{ status: number; payload: RefreshTokenResType }> | null,

  sLogin(body: GuestLoginBodyType) {
    return http.post<GuestLoginResType>('/guest/auth/login', body)
  },

  login(body: GuestLoginBodyType) {
    return http.post<GuestLoginResType>('/api/guest/auth/login', body, {
      baseUrl: ''
    })
  },

  sLogout(body: LogoutBodyType & { accessToken: string }) {
    return http.post(
      '/guest/auth/logout',
      { refreshToken: body.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`
        }
      }
    )
  },

  logout() {
    return http.post('/api/guest/auth/logout', null, {
      baseUrl: ''
    })
  },

  sRefreshToken(body: RefreshTokenBodyType) {
    return http.post<RefreshTokenResType>('/guest/auth/refresh-token', body)
  },

  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }

    this.refreshTokenRequest = http.post<RefreshTokenResType>('/api/guest/auth/refresh-token', null, {
      baseUrl: ''
    })

    const response = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return response
  }
}
