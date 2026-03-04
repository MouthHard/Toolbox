/**
 * 表单验证工具函数
 */

/**
 * 验证是否为有效的URL
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false
  try {
    new URL(url)
    return /^https?:\/\//.test(url)
  } catch {
    return false
  }
}

/**
 * 验证必填字段
 */
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0
}

/**
 * 验证最大长度
 */
export const maxLength = (value: string, max: number): boolean => {
  return value.trim().length <= max
}

/**
 * 验证最小长度
 */
export const minLength = (value: string, min: number): boolean => {
  return value.trim().length >= min
}

/**
 * 验证是否为有效的电子邮件地址
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 工具提交表单验证规则
 */
export const validateToolSubmission = (formData: Record<string, string>) => {
  const errors: Record<string, string> = {}

  if (!isRequired(formData.name)) {
    errors.name = '工具名称不能为空'
  } else if (!maxLength(formData.name, 50)) {
    errors.name = '工具名称不能超过50字'
  }

  if (!isRequired(formData.url)) {
    errors.url = '工具地址不能为空'
  } else if (!isValidUrl(formData.url)) {
    errors.url = '请输入有效的URL地址（必须以http/https开头）'
  }

  if (!isRequired(formData.description)) {
    errors.description = '工具描述不能为空'
  } else if (!maxLength(formData.description, 100)) {
    errors.description = '描述不能超过100字'
  }

  if (!isRequired(formData.category)) {
    errors.category = '请选择一级分类'
  }

  if (!isRequired(formData.subCategory)) {
    errors.subCategory = '请选择二级分类'
  }

  if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
    errors.githubUrl = '请输入有效的GitHub地址'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * 文件夹创建表单验证规则
 */
export const validateFolderCreation = (folderName: string) => {
  const errors: Record<string, string> = {}

  if (!isRequired(folderName)) {
    errors.name = '文件夹名称不能为空'
  } else if (!minLength(folderName, 2)) {
    errors.name = '文件夹名称至少2个字符'
  } else if (!maxLength(folderName, 20)) {
    errors.name = '文件夹名称不能超过20个字符'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
