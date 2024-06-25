import { http } from '@/lib/http'
import { AccountResType, UpdateMeBodyType } from '@/schemaValidations/account.schema'

export const accountService = {
  me() {
    return http.get<AccountResType>('/accounts/me')
  },

  updateMe(body: UpdateMeBodyType) {
    return http.put<AccountResType>('/accounts/me', body)
  }
}
