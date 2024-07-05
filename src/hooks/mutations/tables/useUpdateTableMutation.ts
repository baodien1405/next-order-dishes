import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MutationKeys, QueryKeys } from '@/constants'
import { UpdateTableBodyType } from '@/schemaValidations/table.schema'
import { tableService } from '@/services'

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MutationKeys.UPDATE_TABLE],
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) => tableService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TABLE_LIST],
        exact: true
      })
    }
  })
}
