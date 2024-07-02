import { useQuery } from '@tanstack/react-query'

import { accountService } from '@/services'
import { QueryKeys } from '@/constants'

export const useAccountMeQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.ACCOUNT_PROFILE],
    queryFn: accountService.me
  })
}
