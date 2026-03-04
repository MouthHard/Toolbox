import { useState, useCallback } from 'react'

/**
 * 自定义Hook，用于管理localStorage操作
 * @param key localStorage的键名
 * @param initialValue 初始值或返回初始值的函数
 * @returns [存储的值, 更新值的函数]
 */
export function useLocalStorage<T>(
  key: string, 
  initialValue: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        return JSON.parse(item)
      }
      return typeof initialValue === 'function' 
        ? (initialValue as () => T)() 
        : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return typeof initialValue === 'function' 
        ? (initialValue as () => T)() 
        : initialValue
    }
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = typeof value === 'function' 
          ? (value as (prev: T) => T)(prev) 
          : value
        localStorage.setItem(key, JSON.stringify(valueToStore))
        return valueToStore
      })
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key])

  return [storedValue, setValue]
}
