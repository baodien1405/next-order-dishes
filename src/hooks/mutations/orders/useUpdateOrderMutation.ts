import { useMutation } from '@tanstack/react-query'

import { MutationKeys } from '@/constants'
import { UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { orderService } from '@/services'

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.UPDATE_ORDER],
    mutationFn: ({ id, ...body }: UpdateOrderBodyType & { id: number }) => orderService.update(id, body)
  })
}
