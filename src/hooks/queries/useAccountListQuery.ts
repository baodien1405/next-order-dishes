import { useQuery } from '@tanstack/react-query'

import { accountService } from '@/services'
import { QueryKeys } from '@/constants'

export const useAccountListQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.ACCOUNT_LIST],
    queryFn: accountService.getAll
  })
}
