import { useMutation, useQueryClient } from '@tanstack/react-query'

import { accountService } from '@/services'
import { MutationKeys, QueryKeys } from '@/constants'

export const useAddAccountMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.ADD_ACCOUNT],
    mutationFn: accountService.add,
    onSuccess: () => {
      const queryClient = useQueryClient()

      queryClient.invalidateQueries({
        queryKey: [QueryKeys.ACCOUNT_LIST]
      })
    }
  })
}
