import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { X, ChevronDown } from 'lucide-react'
import type { ToolData } from '@/types/tool'
import { categories } from '@/constants/categories'
import { validateToolSubmission } from '@/utils/validation'
import './index.scss'

interface SubmitToolModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (toolData: ToolData) => void
}

const INITIAL_FORM_DATA = {
  name: '',
  url: '',
  description: '',
  logo: '',
  category: '',
  subCategory: '',
  githubUrl: '',
  detail: '',
  tags: '',
}

const SubmitToolModal: React.FC<SubmitToolModalProps> = memo(({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(isOpen ? INITIAL_FORM_DATA : { ...INITIAL_FORM_DATA })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)
  const subCategoryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
      if (subCategoryRef.current && !subCategoryRef.current.contains(event.target as Node)) {
        setIsSubCategoryOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFormData(INITIAL_FORM_DATA)
        setErrors({})
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }))
      }
    },
    [errors]
  )

  const validateForm = useCallback(() => {
    const { isValid, errors: validationErrors } = validateToolSubmission(formData)
    setErrors(validationErrors)
    return isValid
  }, [formData])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (validateForm()) {
        onSubmit(formData)
        setFormData(INITIAL_FORM_DATA)
        onClose()
      }
    },
    [validateForm, formData, onSubmit, onClose]
  )

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    },
    [onClose]
  )

  const handleCategorySelect = useCallback((categoryName: string) => {
    setFormData((prev) => ({ ...prev, category: categoryName, subCategory: '' }))
    setIsCategoryOpen(false)
  }, [])

  const handleSubCategorySelect = useCallback((subCategoryName: string) => {
    setFormData((prev) => ({ ...prev, subCategory: subCategoryName }))
    setIsSubCategoryOpen(false)
  }, [])

  if (!isOpen) return null

  const currentSubCategories = formData.category
    ? categories.find((c) => c.name === formData.category)?.subCategories || []
    : []

  return (
    <div className="submit-tool-modal" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">提交工具网站</h3>
          <button className="modal-close-btn" onClick={handleClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form id="tool-form" className="modal-body" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                工具名称 <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="请输入工具名称"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                官网地址 <span className="required">*</span>
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className={`form-input ${errors.url ? 'error' : ''}`}
                placeholder="https://example.com"
              />
              {errors.url && <span className="form-error">{errors.url}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              一句话描述 <span className="required">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`form-input ${errors.description ? 'error' : ''}`}
              placeholder="简单介绍这个工具的用途，不超过100字"
              maxLength={100}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
            <div className="char-count">{formData.description.length}/100</div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                一级分类 <span className="required">*</span>
              </label>
              <div className="custom-dropdown" ref={categoryRef}>
                <div
                  className={`form-select ${errors.category ? 'error' : ''}`}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <span>{formData.category || '请选择分类'}</span>
                  <ChevronDown className={`select-arrow ${isCategoryOpen ? 'open' : ''}`} />
                </div>
                {isCategoryOpen && (
                  <div className="dropdown-options">
                    <div className="dropdown-option" onClick={() => handleCategorySelect('')}>
                      请选择分类
                    </div>
                    {categories.map((cat) => (
                      <div
                        key={cat.name}
                        className={`dropdown-option ${formData.category === cat.name ? 'selected' : ''}`}
                        onClick={() => handleCategorySelect(cat.name)}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                二级分类 <span className="required">*</span>
              </label>
              <div className="custom-dropdown" ref={subCategoryRef}>
                <div
                  className={`form-select ${errors.subCategory ? 'error' : ''} ${!formData.category ? 'disabled' : ''}`}
                  onClick={() => formData.category && setIsSubCategoryOpen(!isSubCategoryOpen)}
                >
                  <span>{formData.subCategory || '请先选择一级分类'}</span>
                  <ChevronDown className={`select-arrow ${isSubCategoryOpen ? 'open' : ''}`} />
                </div>
                {isSubCategoryOpen && formData.category && (
                  <div className="dropdown-options">
                    <div className="dropdown-option" onClick={() => handleSubCategorySelect('')}>
                      请先选择一级分类
                    </div>
                    {currentSubCategories.map((subCat) => (
                      <div
                        key={subCat}
                        className={`dropdown-option ${formData.subCategory === subCat ? 'selected' : ''}`}
                        onClick={() => handleSubCategorySelect(subCat)}
                      >
                        {subCat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.subCategory && <span className="form-error">{errors.subCategory}</span>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Logo地址（可选）</label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub地址（可选）</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">详细描述（可选）</label>
            <textarea
              name="detail"
              value={formData.detail}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="详细介绍工具的功能特点、使用场景等"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">标签（可选）</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="form-input"
              placeholder="多个标签用逗号分隔，如：开发,代码,调试"
            />
          </div>
        </form>

        <div className="form-actions">
          <button type="button" className="modal-btn cancel-btn" onClick={handleClose}>
            取消
          </button>
          <button type="submit" className="modal-btn confirm-btn" form="tool-form">
            提交
          </button>
        </div>
      </div>
    </div>
  )
})

export default SubmitToolModal
