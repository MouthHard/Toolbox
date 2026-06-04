/**
 * 安全工具函数
 * 提供XSS防护、数据验证等安全功能
 */

import DOMPurify from 'dompurify'

/**
 * DOMPurify 配置
 */
const DOMPurifyConfig = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'a',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'code',
    'pre',
    'blockquote',
    'div',
    'span',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id', 'title'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover'],
  SANITIZE_DOM: true,
  KEEP_CONTENT: true,
}

/**
 * 清理HTML字符串，防止XSS攻击
 * @param dirty - 需要清理的HTML字符串
 * @param customConfig - 自定义配置
 * @returns 清理后的安全HTML字符串
 */
export const sanitizeHTML = (
  dirty: string,
  customConfig?: Partial<typeof DOMPurifyConfig>
): string => {
  if (!dirty || typeof dirty !== 'string') {
    return ''
  }

  const config = customConfig
    ? { ...DOMPurifyConfig, ...customConfig }
    : DOMPurifyConfig

  return DOMPurify.sanitize(dirty, config)
}

/**
 * 清理URL，防止XSS攻击
 * @param url - 需要清理的URL
 * @returns 清理后的安全URL
 */
export const sanitizeURL = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return ''
  }

  // 移除危险的协议
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  const lowerUrl = url.toLowerCase()

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return ''
    }
  }

  // 验证URL格式
  try {
    const parsedUrl = new URL(url, window.location.origin)
    return parsedUrl.href
  } catch {
    return ''
  }
}

/**
 * 验证并清理用户输入
 * @param input - 用户输入
 * @param maxLength - 最大长度
 * @returns 清理后的输入
 */
export const sanitizeUserInput = (
  input: string,
  maxLength = 1000
): string => {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // 移除HTML标签
  let cleaned = input.replace(/<[^>]*>/g, '')

  // 移除危险字符
  cleaned = cleaned.replace(/[<>"'&]/g, '')

  // 限制长度
  cleaned = cleaned.substring(0, maxLength)

  return cleaned.trim()
}

/**
 * 验证邮箱地址
 * @param email - 邮箱地址
 * @returns 是否有效
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证URL
 * @param url - URL
 * @returns 是否有效
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 转义HTML特殊字符
 * @param unsafe - 不安全的字符串
 * @returns 转义后的安全字符串
 */
export const escapeHTML = (unsafe: string): string => {
  if (!unsafe || typeof unsafe !== 'string') {
    return ''
  }

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * 验证工具ID格式
 * @param toolId - 工具ID
 * @returns 是否有效
 */
export const isValidToolId = (toolId: string): boolean => {
  // 工具ID应该是字母数字、下划线或短横线
  const idRegex = /^[a-zA-Z0-9_-]+$/
  return idRegex.test(toolId) && toolId.length > 0 && toolId.length <= 50
}

/**
 * 验证分类ID格式
 * @param categoryId - 分类ID
 * @returns 是否有效
 */
export const isValidCategoryId = (categoryId: string): boolean => {
  // 分类ID应该是字母数字、下划线或短横线
  const idRegex = /^[a-zA-Z0-9_-]+$/
  return idRegex.test(categoryId) && categoryId.length > 0 && categoryId.length <= 50
}

/**
 * 验证文件夹名称
 * @param folderName - 文件夹名称
 * @returns 是否有效
 */
export const isValidFolderName = (folderName: string): boolean => {
  // 文件夹名称应该是1-50个字符，不包含特殊字符
  const nameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_\-\s]+$/
  return (
    nameRegex.test(folderName) &&
    folderName.trim().length > 0 &&
    folderName.trim().length <= 50
  )
}

/**
 * 验证工具名称
 * @param toolName - 工具名称
 * @returns 是否有效
 */
export const isValidToolName = (toolName: string): boolean => {
  // 工具名称应该是1-100个字符
  return (
    toolName.trim().length > 0 &&
    toolName.trim().length <= 100 &&
    !/<[^>]*>/.test(toolName) // 不包含HTML标签
  )
}

/**
 * 验证工具描述
 * @param description - 工具描述
 * @returns 是否有效
 */
export const isValidToolDescription = (description: string): boolean => {
  // 工具描述应该是1-500个字符
  return (
    description.trim().length > 0 &&
    description.trim().length <= 500
  )
}

/**
 * 生成安全的随机字符串
 * @param length - 字符串长度
 * @returns 安全的随机字符串
 */
export const generateSecureRandomString = (length = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const array = new Uint32Array(length)

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
  } else {
    // 降级方案
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  }

  return result
}

/**
 * 验证CSRF令牌（静态网站模拟）
 * @param token - CSRF令牌
 * @returns 是否有效
 */
export const validateCSRFToken = (token: string): boolean => {
  // 静态网站中，我们使用localStorage存储token
  const storedToken = localStorage.getItem('csrf_token')
  return token === storedToken && token.length > 0
}

/**
 * 生成CSRF令牌
 * @returns CSRF令牌
 */
export const generateCSRFToken = (): string => {
  const token = generateSecureRandomString(32)
  localStorage.setItem('csrf_token', token)
  return token
}

/**
 * 验证内容安全策略（静态网站模拟）
 * @returns CSP配置对象
 */
export const getCSPConfig = () => {
  return {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'", 'https:'],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  }
}

/**
 * 敏感数据脱敏
 * @param data - 需要脱敏的数据
 * @param type - 数据类型
 * @returns 脱敏后的数据
 */
export const maskSensitiveData = (
  data: string,
  type: 'email' | 'phone' | 'id' | 'generic'
): string => {
  if (!data || typeof data !== 'string') {
    return ''
  }

  switch (type) {
    case 'email': {
      const [username, domain] = data.split('@')
      if (username && domain) {
        const maskedUsername =
          username.length > 2
            ? username.substring(0, 2) + '*'.repeat(username.length - 2)
            : '*'.repeat(username.length)
        return `${maskedUsername}@${domain}`
      }
      return '*'.repeat(data.length)
    }

    case 'phone':
      return data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

    case 'id':
      return data.substring(0, 4) + '*'.repeat(data.length - 4)

    case 'generic':
      return data.length > 4
        ? data.substring(0, 2) + '*'.repeat(data.length - 4) + data.substring(data.length - 2)
        : '*'.repeat(data.length)

    default:
      return '*'.repeat(data.length)
  }
}

/**
 * 验证文件类型
 * @param fileName - 文件名
 * @param allowedTypes - 允许的文件类型
 * @returns 是否允许
 */
export const isValidFileType = (
  fileName: string,
  allowedTypes: string[] = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp']
): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return extension ? allowedTypes.includes(extension) : false
}

/**
 * 验证文件大小
 * @param fileSize - 文件大小（字节）
 * @param maxSize - 最大大小（字节）
 * @returns 是否允许
 */
export const isValidFileSize = (fileSize: number, maxSize = 5 * 1024 * 1024): boolean => {
  return fileSize > 0 && fileSize <= maxSize
}