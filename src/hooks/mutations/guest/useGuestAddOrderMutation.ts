import { useMutation } from '@tanstack/react-query'

import { MutationKeys } from '@/constants'
import { guestService } from '@/services'

export const useGuestAddOrderMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.GUEST_ADD_ORDER],
    mutationFn: guestService.addOrder
  })
}
