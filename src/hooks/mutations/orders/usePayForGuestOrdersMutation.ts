import { useMutation } from '@tanstack/react-query'

import { MutationKeys } from '@/constants'
import { PayGuestOrdersBodyType } from '@/schemaValidations/order.schema'
import { orderService } from '@/services'

export const usePayForGuestOrdersMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.PAY_GUEST_ORDERS],
    mutationFn: (body: PayGuestOrdersBodyType) => orderService.pay(body)
  })
}
