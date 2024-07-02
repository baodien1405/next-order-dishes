import { useMutation } from '@tanstack/react-query'

import { authService } from '@/services'
import { MutationKeys } from '@/constants'

export const useLogoutMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.LOGOUT],
    mutationFn: authService.logout
  })
}
