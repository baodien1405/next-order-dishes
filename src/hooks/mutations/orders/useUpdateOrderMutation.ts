import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MutationKeys, QueryKeys } from '@/constants'
import { UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { orderService } from '@/services'

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MutationKeys.UPDATE_ORDER],
    mutationFn: ({ id, ...body }: UpdateOrderBodyType & { id: number }) => orderService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.ORDER_LIST],
        exact: true
      })
    }
  })
}
