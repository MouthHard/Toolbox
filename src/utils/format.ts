/**
 * 格式化数字为简洁显示格式
 * @param num 要格式化的数字
 * @returns 格式化后的字符串，如 1.2k, 3.5M 等
 */
export const formatNumber = (num: number): string => {
  if (num === undefined || num === null) {
    return '0'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 复制是否成功
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) {
    return false
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    // 隐藏textarea，避免页面闪烁
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  }
}

/**
 * 格式化时间为相对时间
 * @param date 日期对象或时间戳
 * @returns 相对时间字符串，如 "1小时前"
 */
export const formatRelativeTime = (date: Date | number): string => {
  const now = new Date()
  const targetDate = new Date(date)
  const diff = now.getTime() - targetDate.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return targetDate.toLocaleDateString()
  }
}
