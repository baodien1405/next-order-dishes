import { useMutation } from '@tanstack/react-query'

import { MutationKeys } from '@/constants'
import { orderService } from '@/services'

export const useAddOrderMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.ADD_ORDER],
    mutationFn: orderService.add
  })
}
