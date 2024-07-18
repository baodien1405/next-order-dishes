import { useQuery } from '@tanstack/react-query'

import { QueryKeys } from '@/constants'
import { orderService } from '@/services'
import { GetOrdersQueryParamsType } from '@/schemaValidations/order.schema'

export const useOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryKey: [QueryKeys.ORDER_LIST, queryParams],
    queryFn: () => orderService.getAll(queryParams)
  })
}
