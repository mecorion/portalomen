export type ApiRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiErrorKind = 'network' | 'http' | 'parse' | 'unknown'

export type ApiError = {
  kind: ApiErrorKind
  message: string
  status?: number
  details?: unknown
}

export type ApiSuccess<T> = {
  status: 'success'
  data: T
}

export type ApiFailure = {
  status: 'error'
  error: ApiError
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure

export type ApiRequestOptions = {
  method?: ApiRequestMethod
  headers?: Record<string, string>
  body?: unknown
  signal?: AbortSignal
  parseJson?: boolean
}

export type ApiClientOptions = {
  baseUrl?: string
  defaultHeaders?: Record<string, string>
}

export type ApiClient = {
  request<T>(path: string, options?: ApiRequestOptions): Promise<ApiResult<T>>
  get<T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResult<T>>
  post<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResult<T>>
  put<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResult<T>>
  patch<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResult<T>>
  delete<T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResult<T>>
}
