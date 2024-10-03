import { envConfig } from '@/configs'
import { normalizePath } from '@/lib/utils'
import { LoginResType } from '@/schemaValidations/auth.schema'
import {
  getAccessTokenFromLS,
  removeAccessTokenToLS,
  removeRefreshTokenToLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '@/lib/common'
import { path } from '@/constants'
import { redirect } from '@/i18n/routing'

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string
}

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }

  constructor({ message = 'Http Error', status, payload }: { status: number; payload: any; message?: string }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS
  payload: EntityErrorPayload

  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
    super({ message: 'Entity Error', status, payload })
    this.status = status
    this.payload = payload
  }
}

let clientLogoutRequest: null | Promise<any>

export const isClient = typeof window !== 'undefined'

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  options?: CustomOptions
) => {
  let body: FormData | string | undefined = undefined

  if (options?.body instanceof FormData) {
    body = options.body
  } else if (options?.body) {
    body = JSON.stringify(options.body)
  }

  const baseHeaders: { [key: string]: string } = body instanceof FormData ? {} : { 'Content-Type': 'application/json' }

  if (isClient) {
    const accessToken = getAccessTokenFromLS()
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl
  const fullUrl = `${baseUrl}/${normalizePath(url)}`

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    } as any,
    body,
    method
  })

  const payload: Response = await res.json()
  const data = {
    status: res.status,
    payload
  }

  // Handle interceptors
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422
          payload: EntityErrorPayload
        }
      )
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      // Handle auto logout from next client
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch('/api/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ force: true }),
            headers: {}
          })

          try {
            await clientLogoutRequest
          } catch (error) {
          } finally {
            removeAccessTokenToLS()
            removeRefreshTokenToLS()
            clientLogoutRequest = null
            location.href = path.LOGIN
          }
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization.split('Bearer ')[1]
        redirect(`${path.LOGOUT}?accessToken=${accessToken}`)
      }
    } else {
      throw new HttpError(data)
    }
  }

  if (isClient) {
    const normalizeUrl = normalizePath(url)

    if (['api/auth/login', 'api/guest/auth/login'].includes(normalizeUrl)) {
      const { accessToken, refreshToken } = (payload as LoginResType).data
      setAccessTokenToLS(accessToken)
      setRefreshTokenToLS(refreshToken)
    } else if ('api/auth/token' === normalizeUrl) {
      const { accessToken, refreshToken } = payload as { accessToken: string; refreshToken: string }
      setAccessTokenToLS(accessToken)
      setRefreshTokenToLS(refreshToken)
    } else if (['api/auth/logout', 'api/guest/auth/logout'].includes(normalizeUrl)) {
      removeAccessTokenToLS()
      removeRefreshTokenToLS()
    }
  }

  return data
}

export const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>('GET', url, options)
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>('PUT', url, { ...options, body })
  },
  patch<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>('PATCH', url, { ...options, body })
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>('DELETE', url, { ...options })
  }
}
