import queryString from 'query-string'

import { http } from '@/lib/http'
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType
} from '@/schemaValidations/order.schema'

const PREFIX = '/orders'

export const orderService = {
  getAll(queryParams: GetOrdersQueryParamsType) {
    const params = queryString.stringify({
      fromDate: queryParams.fromDate?.toISOString(),
      toDate: queryParams.toDate?.toISOString()
    })

    return http.get<GetOrdersResType>(`${PREFIX}?${params}`)
  },

  get(orderId: number) {
    return http.get<GetOrderDetailResType>(`${PREFIX}/${orderId}`)
  },

  add(body: CreateOrdersBodyType) {
    return http.post<CreateOrdersResType>(PREFIX, body)
  },

  update(id: number, body: UpdateOrderBodyType) {
    return http.put<UpdateOrderResType>(`${PREFIX}/${id}`, body)
  },

  pay(body: PayGuestOrdersBodyType) {
    return http.post<PayGuestOrdersResType>(`${PREFIX}/pay`, body)
  }
}
