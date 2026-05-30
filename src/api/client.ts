import type {
  ApiClient,
  ApiClientOptions,
  ApiError,
  ApiRequestOptions,
  ApiResult
} from './types'

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const baseUrl = normalizeBaseUrl(options.baseUrl ?? '')
  const defaultHeaders = options.defaultHeaders ?? {}

  async function request<T>(
    path: string,
    requestOptions: ApiRequestOptions = {}
  ): Promise<ApiResult<T>> {
    const method = requestOptions.method ?? 'GET'
    const hasBody = requestOptions.body !== undefined
    const headers = {
      ...defaultHeaders,
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...requestOptions.headers
    }

    try {
      const response = await fetch(buildUrl(baseUrl, path), {
        method,
        headers,
        body: hasBody ? JSON.stringify(requestOptions.body) : undefined,
        signal: requestOptions.signal
      })

      const parsedBody = await parseResponseBody(response, requestOptions.parseJson ?? true)

      if (!response.ok) {
        return {
          status: 'error',
          error: {
            kind: 'http',
            status: response.status,
            message: getHttpErrorMessage(response, parsedBody),
            details: parsedBody
          }
        }
      }

      return {
        status: 'success',
        data: parsedBody as T
      }
    } catch (error) {
      return {
        status: 'error',
        error: normalizeRequestError(error)
      }
    }
  }

  return {
    request,
    get: (path, requestOptions) => request(path, { ...requestOptions, method: 'GET' }),
    post: (path, body, requestOptions) => request(path, { ...requestOptions, method: 'POST', body }),
    put: (path, body, requestOptions) => request(path, { ...requestOptions, method: 'PUT', body }),
    patch: (path, body, requestOptions) => request(path, { ...requestOptions, method: 'PATCH', body }),
    delete: (path, requestOptions) => request(path, { ...requestOptions, method: 'DELETE' })
  }
}

async function parseResponseBody(response: Response, parseJson: boolean): Promise<unknown> {
  if (response.status === 204 || !parseJson) {
    return undefined
  }

  const text = await response.text()

  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    throw {
      kind: 'parse',
      message: 'Не удалось разобрать ответ API как JSON',
      details: error
    } satisfies ApiError
  }
}

function buildUrl(baseUrl: string, path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '')
}

function getHttpErrorMessage(response: Response, body: unknown): string {
  if (isRecord(body) && typeof body.message === 'string') {
    return body.message
  }

  return `API вернул ошибку ${response.status}`
}

function normalizeRequestError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error
  }

  if (error instanceof Error) {
    return {
      kind: 'network',
      message: error.message,
      details: error
    }
  }

  return {
    kind: 'unknown',
    message: 'Неизвестная ошибка API',
    details: error
  }
}

function isApiError(error: unknown): error is ApiError {
  return isRecord(error)
    && typeof error.kind === 'string'
    && typeof error.message === 'string'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
