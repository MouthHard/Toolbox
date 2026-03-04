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

// 基础URL，根据环境自动切换
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 请求超时时间
const DEFAULT_TIMEOUT = 10000

/**
 * 处理请求参数
 */
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

/**
 * 统一请求错误处理
 */
const handleError = <T = unknown>(error: Error | Response): ResponseData<T> => {
  console.error('请求错误:', error)
  if (error instanceof Response) {
    return {
      code: error.status,
      data: null as T,
      message: error.statusText || '网络请求错误',
      success: false,
    }
  }
  return {
    code: -1,
    data: null as T,
    message: error.message || '未知错误',
    success: false,
  }
}

/**
 * 统一请求封装
 */
const request = async <T = unknown>(
  url: string,
  config: RequestConfig = {}
): Promise<ResponseData<T>> => {
  try {
    const { params, timeout = DEFAULT_TIMEOUT, headers, ...restConfig } = config

    // 处理URL和参数
    const requestUrl = handleParams(`${BASE_URL}${url}`, params)

    // 超时处理
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    // 默认配置
    const defaultConfig: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include', // 跨域携带cookie
      signal: controller.signal,
      ...restConfig,
    }

    // 发送请求
    const response = await fetch(requestUrl, defaultConfig)
    clearTimeout(timeoutId)

    // 处理响应
    if (!response.ok) {
      throw response
    }

    // 尝试解析JSON响应
    try {
      const result = await response.json()
      return result as ResponseData<T>
    } catch {
      // 非JSON响应处理
      return {
        code: 200,
        data: await response.text() as unknown as T,
        message: '请求成功',
        success: true,
      }
    }
  } catch (error) {
    return handleError<T>(error as Error | Response)
  }
}

/**
 * GET请求
 */
export const get = <T = unknown>(url: string, config?: RequestConfig): Promise<ResponseData<T>> => {
  return request<T>(url, { ...config, method: 'GET' })
}

/**
 * POST请求
 */
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

/**
 * PUT请求
 */
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

/**
 * DELETE请求
 */
export const del = <T = unknown>(url: string, config?: RequestConfig): Promise<ResponseData<T>> => {
  return request<T>(url, { ...config, method: 'DELETE' })
}

/**
 * 上传文件
 */
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
      // 上传文件时不需要设置Content-Type，浏览器会自动设置
      ...config?.headers,
    },
  })
}

export default request
