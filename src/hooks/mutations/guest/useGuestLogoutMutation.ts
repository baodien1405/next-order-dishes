import { useMutation } from '@tanstack/react-query'

import { MutationKeys } from '@/constants'
import { guestService } from '@/services'

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.GUEST_LOGOUT],
    mutationFn: guestService.logout
  })
}
