import queryString from 'query-string'

import { http } from '@/lib/http'
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from '@/schemaValidations/indicator.schema'

const PREFIX = '/indicators'

export const indicatorsService = {
  getDashboardIndicators(queryParams: DashboardIndicatorQueryParamsType) {
    const params = queryString.stringify({
      fromDate: queryParams.fromDate.toISOString(),
      toDate: queryParams.toDate.toISOString()
    })

    return http.get<DashboardIndicatorResType>(`${PREFIX}/dashboard?${params}`)
  }
}
