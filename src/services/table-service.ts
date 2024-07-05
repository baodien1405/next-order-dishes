import { http } from '@/lib/http'
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType
} from '@/schemaValidations/table.schema'

const PREFIX = '/tables'

export const tableService = {
  getAll() {
    return http.get<TableListResType>(PREFIX)
  },

  get(id: number) {
    return http.get<TableResType>(`${PREFIX}/${id}`)
  },

  add(body: CreateTableBodyType) {
    return http.post<TableResType>(PREFIX, body)
  },

  update(id: number, body: UpdateTableBodyType) {
    return http.put<TableResType>(`${PREFIX}/${id}`, body)
  },

  delete(id: number) {
    return http.delete<TableResType>(`${PREFIX}/${id}`)
  }
}
