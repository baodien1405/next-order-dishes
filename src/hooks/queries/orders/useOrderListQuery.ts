import { useQuery } from '@tanstack/react-query'

import { QueryKeys } from '@/constants'
import { orderService } from '@/services'

export const useOrderListQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.ORDER_LIST],
    queryFn: orderService.getAll
  })
}
