import { useMutation } from '@tanstack/react-query'

import { MutationKeys } from '@/constants'
import { guestService } from '@/services'

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.GUEST_LOGIN],
    mutationFn: guestService.login
  })
}
