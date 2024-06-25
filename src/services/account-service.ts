import { http } from '@/lib/http'
import { AccountResType } from '@/schemaValidations/account.schema'

export const accountService = {
  me() {
    return http.get<AccountResType>('/accounts/me')
  }
}
