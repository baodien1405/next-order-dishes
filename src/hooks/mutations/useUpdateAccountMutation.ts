import { useMutation, useQueryClient } from '@tanstack/react-query'

import { accountService } from '@/services'
import { MutationKeys, QueryKeys } from '@/constants'
import { UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'

export const useUpdateAccountMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.UPDATE_ACCOUNT],
    mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) => accountService.update(id, body),
    onSuccess: () => {
      const queryClient = useQueryClient()

      queryClient.invalidateQueries({
        queryKey: [QueryKeys.ACCOUNT_LIST]
      })
    }
  })
}
