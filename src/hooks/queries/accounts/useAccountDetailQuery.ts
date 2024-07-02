import { useQuery } from '@tanstack/react-query'

import { accountService } from '@/services'
import { QueryKeys } from '@/constants'

export const useAccountDetailQuery = (accountId: number) => {
  return useQuery({
    queryKey: [QueryKeys.ACCOUNT_DETAIL, accountId],
    queryFn: () => accountService.get(accountId)
  })
}
