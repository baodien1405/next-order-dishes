import { http } from '@/lib/http'
import { GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from '@/schemaValidations/order.schema'

const PREFIX = '/orders'

export const orderService = {
  getAll() {
    return http.get<GetOrdersResType>(PREFIX)
  },

  update(id: number, body: UpdateOrderBodyType) {
    return http.put<UpdateOrderResType>(`${PREFIX}/${id}`, body)
  }
}
