/**
 * API请求工具
 * 封装fetch API，提供统一的请求处理、错误处理和超时处理
 */

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>
  timeout?: number
  headers?: Record<string, string>
}

interface ResponseData<T = unknown> {
  code: number
  data: T
  message: string
  success: boolean
}

interface RequestError extends Error {
  code?: number
  response?: Response
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const DEFAULT_TIMEOUT = 10000

const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || 'INFO'

const shouldLog = (level: string): boolean => {
  const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
  const currentIndex = levels.indexOf(LOG_LEVEL)
  const targetIndex = levels.indexOf(level)
  return targetIndex >= currentIndex
}

const logError = (message: string, details?: Record<string, unknown>): void => {
  if (shouldLog('ERROR')) {
    console.error(`[Request Error] ${message}`, details)
  }
}

const logInfo = (message: string, details?: Record<string, unknown>): void => {
  if (shouldLog('INFO')) {
    console.info(`[Request Info] ${message}`, details)
  }
}

const handleParams = (url: string, params?: Record<string, string | number | boolean>): string => {
  if (!params) return url
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  const queryString = searchParams.toString()
  return queryString ? `${url}?${queryString}` : url
}

const createRequestError = (error: Error | Response): RequestError => {
  if (error instanceof Response) {
    const requestError: RequestError = new Error(error.statusText || '网络请求错误')
    requestError.code = error.status
    requestError.response = error
    return requestError
  }
  const requestError: RequestError = new Error(error.message || '未知错误')
  requestError.code = -1
  return requestError
}

const handleError = <T = unknown>(error: Error | Response): ResponseData<T> => {
  const requestError = createRequestError(error)
  const errorDetails = {
    code: requestError.code,
    message: requestError.message,
    url: requestError.response?.url,
    timestamp: new Date().toISOString(),
  }

  logError(requestError.message, errorDetails)

  return {
    code: requestError.code || -1,
    data: null as T,
    message: requestError.message,
    success: false,
  }
}

const request = async <T = unknown>(
  url: string,
  config: RequestConfig = {}
): Promise<ResponseData<T>> => {
  const startTime = Date.now()
  const { params, timeout = DEFAULT_TIMEOUT, headers, ...restConfig } = config
  const requestUrl = handleParams(`${BASE_URL}${url}`, params)

  logInfo(`发起请求`, { url: requestUrl, method: restConfig.method || 'GET' })

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      const timeoutError: RequestError = new Error('请求超时')
      timeoutError.code = 408
      throw timeoutError
    }, timeout)

    const defaultConfig: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include',
      signal: controller.signal,
      ...restConfig,
    }

    const response = await fetch(requestUrl, defaultConfig)
    clearTimeout(timeoutId)

    const duration = Date.now() - startTime
    logInfo(`请求完成`, { url: requestUrl, status: response.status, duration })

    if (!response.ok) {
      throw response
    }

    try {
      const result = await response.json()
      return result as ResponseData<T>
    } catch {
      const textData = await response.text()
      return {
        code: 200,
        data: textData as unknown as T,
        message: '请求成功',
        success: true,
      }
    }
  } catch (error) {
    const duration = Date.now() - startTime
    logError(`请求失败`, { url: requestUrl, duration })
    return handleError<T>(error as Error | Response)
  }
}

export const get = <T = unknown>(url: string, config?: RequestConfig): Promise<ResponseData<T>> => {
  return request<T>(url, { ...config, method: 'GET' })
}

export const post = <T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig
): Promise<ResponseData<T>> => {
  return request<T>(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

export const put = <T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig
): Promise<ResponseData<T>> => {
  return request<T>(url, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

export const del = <T = unknown>(url: string, config?: RequestConfig): Promise<ResponseData<T>> => {
  return request<T>(url, { ...config, method: 'DELETE' })
}

export const upload = <T = unknown>(
  url: string,
  formData: FormData,
  config?: RequestConfig
): Promise<ResponseData<T>> => {
  return request<T>(url, {
    ...config,
    method: 'POST',
    body: formData,
    headers: {
      ...config?.headers,
    },
  })
}

export default request
export type { ResponseData, RequestConfig, RequestError }
