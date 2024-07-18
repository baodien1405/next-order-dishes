import { useQuery } from '@tanstack/react-query'

import { QueryKeys } from '@/constants'
import { orderService } from '@/services'

export const useOrderDetailQuery = (orderId: number) => {
  return useQuery({
    queryKey: [QueryKeys.ORDER_DETAIL, orderId],
    queryFn: () => orderService.get(orderId),
    enabled: Boolean(orderId)
  })
}
