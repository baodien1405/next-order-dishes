import { useMutation } from '@tanstack/react-query'

import { accountService } from '@/services'
import { MutationKeys } from '@/constants'

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.CHANGE_PASSWORD],
    mutationFn: accountService.changePassword
  })
}
