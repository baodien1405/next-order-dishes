import { http } from '@/lib/http'
import { AccountResType, ChangePasswordBodyType, UpdateMeBodyType } from '@/schemaValidations/account.schema'

export const accountService = {
  me() {
    return http.get<AccountResType>('/accounts/me')
  },

  updateMe(body: UpdateMeBodyType) {
    return http.put<AccountResType>('/accounts/me', body)
  },

  changePassword(body: ChangePasswordBodyType) {
    return http.put<AccountResType>('/accounts/change-password', body)
  }
}
