/**
 * 可访问性工具函数
 * 提供键盘导航、焦点管理等可访问性功能
 */

/**
 * 处理键盘事件，支持 Enter 和 Space 键触发点击
 * @param event - 键盘事件
 * @param callback - 触发时的回调函数
 */
export const handleKeyboardClick = (
  event: React.KeyboardEvent,
  callback: () => void
): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    callback()
  }
}

/**
 * 生成唯一的 ARIA ID
 * @param prefix - ID 前缀
 * @returns 唯一的 ARIA ID
 */
export const generateAriaId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * 获取元素的 ARIA 标签
 * @param type - 元素类型
 * @param content - 元素内容
 * @returns ARIA 标签
 */
export const getAriaLabel = (type: string, content?: string): string => {
  const labels: Record<string, string> = {
    button: '按钮',
    link: '链接',
    input: '输入框',
    modal: '模态框',
    dialog: '对话框',
    alert: '提示',
    tooltip: '提示信息',
  }

  const baseLabel = labels[type] || '元素'
  return content ? `${content}${baseLabel}` : baseLabel
}

/**
 * 检查元素是否可聚焦
 * @param element - DOM 元素
 * @returns 是否可聚焦
 */
export const isFocusable = (element: HTMLElement): boolean => {
  const focusableElements = [
    'button',
    'input',
    'select',
    'textarea',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
  ]

  return focusableElements.some((selector) => element.matches(selector))
}

/**
 * 获取所有可聚焦元素
 * @param container - 容器元素
 * @returns 可聚焦元素数组
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  return Array.from(focusableElements)
}

/**
 * 焦点陷阱 - 在模态框中使用
 * @param event - 键盘事件
 * @param container - 容器元素
 */
export const trapFocus = (
  event: React.KeyboardEvent,
  container: HTMLElement | null
): void => {
  if (event.key !== 'Tab' || !container) return

  const focusableElements = getFocusableElements(container)
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      event.preventDefault()
      lastElement?.focus()
    }
  } else {
    if (document.activeElement === lastElement) {
      event.preventDefault()
      firstElement?.focus()
    }
  }
}

/**
 * 管理焦点 - 用于模态框打开和关闭
 */
export class FocusManager {
  private previousActiveElement: HTMLElement | null = null

  /**
   * 保存当前焦点元素
   */
  saveFocus(): void {
    this.previousActiveElement = document.activeElement as HTMLElement
  }

  /**
   * 恢复焦点
   */
  restoreFocus(): void {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus()
    }
  }

  /**
   * 将焦点设置到指定元素
   * @param element - 目标元素
   */
  setFocus(element: HTMLElement): void {
    setTimeout(() => {
      element.focus()
    }, 0)
  }
}

/**
 * 宣布屏幕阅读器消息
 * @param message - 要宣布的消息
 */
export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * 检查颜色对比度是否符合 WCAG 标准
 * @param foreground - 前景色（十六进制）
 * @param background - 背景色（十六进制）
 * @returns 对比度比值
 */
export const getContrastRatio = (
  foreground: string,
  background: string
): number => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.replace('#', ''), 16)
    const r = ((rgb >> 16) & 0xff) / 255
    const g = ((rgb >> 8) & 0xff) / 255
    const b = (rgb & 0xff) / 255

    const [R, G, B] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    )

    return 0.2126 * R + 0.7152 * G + 0.0722 * B
  }

  const L1 = getLuminance(foreground)
  const L2 = getLuminance(background)

  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * 检查对比度是否满足 WCAG AA 标准
 * @param ratio - 对比度比值
 * @param isLargeText - 是否为大文本
 * @returns 是否满足标准
 */
export const meetsWCAGAA = (ratio: number, isLargeText = false): boolean => {
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * 检查对比度是否满足 WCAG AAA 标准
 * @param ratio - 对比度比值
 * @param isLargeText - 是否为大文本
 * @returns 是否满足标准
 */
export const meetsWCAGAAA = (ratio: number, isLargeText = false): boolean => {
  return isLargeText ? ratio >= 4.5 : ratio >= 7
}