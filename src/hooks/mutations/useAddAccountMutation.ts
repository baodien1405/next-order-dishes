import { useMutation, useQueryClient } from '@tanstack/react-query'

import { accountService } from '@/services'
import { MutationKeys, QueryKeys } from '@/constants'

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MutationKeys.ADD_ACCOUNT],
    mutationFn: accountService.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.ACCOUNT_LIST]
      })
    }
  })
}
