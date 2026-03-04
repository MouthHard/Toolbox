/**
 * 弹窗事件处理工具函数
 * 统一阻止冒泡和默认行为，避免点击穿透
 */

/**
 * 阻止事件冒泡和默认行为
 */
export const stopEventPropagation = (e: React.MouseEvent | React.FormEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

/**
 * 弹窗内容点击事件处理，只阻止冒泡，不阻止默认行为
 */
export const handleModalContentClick = (e: React.MouseEvent) => {
  e.stopPropagation()
}

/**
 * 弹窗按钮点击事件处理，阻止冒泡和默认行为
 */
export const handleModalButtonClick = (e: React.MouseEvent, callback?: () => void) => {
  e.preventDefault()
  e.stopPropagation()
  callback?.()
}

/**
 * 表单提交事件处理，阻止冒泡和默认行为
 */
export const handleFormSubmit = (e: React.FormEvent, callback?: () => void) => {
  e.preventDefault()
  e.stopPropagation()
  callback?.()
}

/**
 * 点击外部关闭弹窗的处理函数
 * @param event 点击事件
 * @param containerRef 弹窗容器的ref
 * @param onClose 关闭回调函数
 */
export const handleClickOutside = (
  event: React.MouseEvent,
  containerRef: React.RefObject<HTMLElement>,
  onClose: () => void
) => {
  if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
    onClose()
  }
}
