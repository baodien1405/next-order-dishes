import { useQuery } from '@tanstack/react-query'

import { QueryKeys } from '@/constants'
import { accountService } from '@/services'
import { GetGuestListQueryParamsType } from '@/schemaValidations/account.schema'

export const useGuestListQuery = (queryParams: GetGuestListQueryParamsType) => {
  return useQuery({
    queryKey: [QueryKeys.GUEST_LIST, queryParams],
    queryFn: () => accountService.getGuestList(queryParams)
  })
}
