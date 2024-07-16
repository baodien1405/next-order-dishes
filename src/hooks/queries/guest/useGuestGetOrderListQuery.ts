import { useQuery } from '@tanstack/react-query'

import { QueryKeys } from '@/constants'
import { guestService } from '@/services'

export const useGuestGetOrderListQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.GUEST_ORDER_LIST],
    queryFn: guestService.getOrderList
  })
}
