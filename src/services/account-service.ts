import { http } from '@/lib/http'
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'

export const accountService = {
  me() {
    return http.get<AccountResType>('/accounts/me')
  },

  sMe(accessToken: string) {
    return http.get<AccountResType>('/accounts/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  updateMe(body: UpdateMeBodyType) {
    return http.put<AccountResType>('/accounts/me', body)
  },

  changePassword(body: ChangePasswordBodyType) {
    return http.put<AccountResType>('/accounts/change-password', body)
  },

  getAll() {
    return http.get<AccountListResType>('/accounts')
  },

  get(id: number) {
    return http.get<AccountResType>(`/accounts/detail/${id}`)
  },

  add(body: CreateEmployeeAccountBodyType) {
    return http.post<AccountResType>('/accounts', body)
  },

  update(id: number, body: UpdateEmployeeAccountBodyType) {
    return http.put<AccountResType>(`/accounts/detail/${id}`, body)
  },

  delete(id: number) {
    return http.delete<AccountResType>(`/accounts/detail/${id}`)
  }
}
