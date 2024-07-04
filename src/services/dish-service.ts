import { http } from '@/lib/http'
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'

const PREFIX = '/dishes'

export const dishService = {
  getAll() {
    return http.get<DishListResType>(PREFIX)
  },

  get(id: number) {
    return http.get<DishResType>(`${PREFIX}/${id}`)
  },

  add(body: CreateDishBodyType) {
    return http.post<DishResType>(PREFIX, body)
  },

  update(id: number, body: UpdateDishBodyType) {
    return http.put<DishResType>(`${PREFIX}/${id}`, body)
  },

  delete(id: number) {
    return http.delete<DishResType>(`${PREFIX}/${id}`)
  }
}
