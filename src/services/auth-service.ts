import { http } from '@/lib/http'
import { LoginBodyType, LoginResType } from '@/schemaValidations/auth.schema'

export const authService = {
  sLogin(body: LoginBodyType) {
    return http.post<LoginResType>('/auth/login', body)
  },

  login(body: LoginBodyType) {
    return http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: ''
    })
  }
}
