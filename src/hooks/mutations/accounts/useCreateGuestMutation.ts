import { useMutation } from '@tanstack/react-query'

import { accountService } from '@/services'
import { MutationKeys } from '@/constants'

export const useCreateGuestMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.CREATE_GUEST],
    mutationFn: accountService.createGuest
  })
}
