import queryString from 'query-string'

import { http } from '@/lib/http'
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  CreateEmployeeAccountBodyType,
  CreateGuestBodyType,
  CreateGuestResType,
  GetGuestListQueryParamsType,
  GetListGuestsResType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'

const PREFIX = '/accounts'

export const accountService = {
  me() {
    return http.get<AccountResType>(`${PREFIX}/me`)
  },

  sMe(accessToken: string) {
    return http.get<AccountResType>(`${PREFIX}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  updateMe(body: UpdateMeBodyType) {
    return http.put<AccountResType>(`${PREFIX}/me`, body)
  },

  changePassword(body: ChangePasswordBodyType) {
    return http.put<AccountResType>(`${PREFIX}/change-password`, body)
  },

  changePasswordV2(body: ChangePasswordV2BodyType) {
    return http.put<ChangePasswordV2ResType>(`/api${PREFIX}/change-password-v2`, body, {
      baseUrl: ''
    })
  },

  sChangePasswordV2(body: ChangePasswordV2BodyType & { accessToken: string }) {
    return http.put<ChangePasswordV2ResType>(`${PREFIX}/change-password-v2`, body, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`
      }
    })
  },

  getAll() {
    return http.get<AccountListResType>(PREFIX)
  },

  get(id: number) {
    return http.get<AccountResType>(`${PREFIX}/detail/${id}`)
  },

  add(body: CreateEmployeeAccountBodyType) {
    return http.post<AccountResType>(PREFIX, body)
  },

  update(id: number, body: UpdateEmployeeAccountBodyType) {
    return http.put<AccountResType>(`${PREFIX}/detail/${id}`, body)
  },

  delete(id: number) {
    return http.delete<AccountResType>(`${PREFIX}/detail/${id}`)
  },

  getGuestList(queryParams: GetGuestListQueryParamsType) {
    const params = queryString.stringify({
      fromDate: queryParams.fromDate?.toISOString(),
      toDate: queryParams.toDate?.toISOString()
    })

    return http.get<GetListGuestsResType>(`${PREFIX}/guests?${params}`)
  },

  createGuest(body: CreateGuestBodyType) {
    return http.post<CreateGuestResType>(`${PREFIX}/guests`, body)
  }
}
