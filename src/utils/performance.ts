/**
 * 性能优化工具函数
 * 提供防抖、节流、懒加载等性能优化功能
 */

import React from 'react'

/**
 * 防抖函数
 * @param func - 需要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 * @param func - 需要节流的函数
 * @param limit - 时间限制（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 图片懒加载 Hook
 * @param src - 图片地址
 * @param options - IntersectionObserver 选项
 * @returns 图片是否可见
 */
export const useLazyLoadImage = (
  src: string,
  options?: IntersectionObserverInit
): { isLoaded: boolean; imgRef: React.RefObject<HTMLImageElement | null> } => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [src, options])

  return { isLoaded, imgRef }
}

/**
 * 虚拟列表 Hook（简化版）
 * @param items - 列表项
 * @param itemHeight - 每项高度
 * @param containerHeight - 容器高度
 * @returns 可见项和滚动处理
 */
export const useVirtualList = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0)

  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )

  const visibleItems = items.slice(startIndex, endIndex)
  const offsetY = startIndex * itemHeight

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    },
    []
  )

  return {
    visibleItems,
    offsetY,
    handleScroll,
    totalHeight: items.length * itemHeight,
  }
}

/**
 * 请求动画帧节流
 * @param callback - 回调函数
 * @returns 节流后的函数
 */
export const rafThrottle = <T extends (...args: unknown[]) => unknown>(
  callback: T
): ((...args: Parameters<T>) => void) => {
  let rafId: number | null = null

  return (...args: Parameters<T>) => {
    if (rafId !== null) {
      return
    }

    rafId = requestAnimationFrame(() => {
      callback(...args)
      rafId = null
    })
  }
}

/**
 * 批量更新状态
 * @param updates - 状态更新函数数组
 */
export const batchUpdates = (updates: Array<() => void>) => {
  updates.forEach((update) => update())
}

/**
 * 缓存计算结果
 * @param fn - 计算函数
 * @param keyGenerator - 缓存键生成函数
 * @returns 带缓存的函数
 */
export const memoize = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, unknown>()

  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * 懒加载组件
 * @param importFn - 动态导入函数
 * @returns 懒加载的组件
 */
export const lazyLoad = <P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>
) => {
  return React.lazy(() => importFn())
}

/**
 * 预加载资源
 * @param resources - 资源URL数组
 */
export const preloadResources = (resources: string[]) => {
  resources.forEach((resource) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource

    if (resource.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      link.as = 'image'
    } else if (resource.match(/\.(css)$/i)) {
      link.as = 'style'
    } else if (resource.match(/\.(js)$/i)) {
      link.as = 'script'
    }

    document.head.appendChild(link)
  })
}

/**
 * 预连接到域名
 * @param domains - 域名数组
 */
export const preconnectDomains = (domains: string[]) => {
  domains.forEach((domain) => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    document.head.appendChild(link)
  })
}

/**
 * 性能监控
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()
  private measures: Map<string, number[]> = new Map()

  /**
   * 开始标记
   * @param name - 标记名称
   */
  startMark(name: string): void {
    this.marks.set(name, performance.now())
  }

  /**
   * 结束标记并记录测量
   * @param name - 标记名称
   * @returns 持续时间（毫秒）
   */
  endMark(name: string): number {
    const startTime = this.marks.get(name)
    if (!startTime) {
      console.warn(`Mark "${name}" not found`)
      return 0
    }

    const duration = performance.now() - startTime
    this.marks.delete(name)

    if (!this.measures.has(name)) {
      this.measures.set(name, [])
    }
    this.measures.get(name)!.push(duration)

    return duration
  }

  /**
   * 获取平均测量时间
   * @param name - 标记名称
   * @returns 平均时间（毫秒）
   */
  getAverageMeasure(name: string): number {
    const measures = this.measures.get(name)
    if (!measures || measures.length === 0) {
      return 0
    }

    return measures.reduce((sum, time) => sum + time, 0) / measures.length
  }

  /**
   * 获取所有测量结果
   * @returns 测量结果对象
   */
  getAllMeasures(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {}

    this.measures.forEach((measures, name) => {
      result[name] = {
        average: this.getAverageMeasure(name),
        count: measures.length,
      }
    })

    return result
  }

  /**
   * 清除所有标记和测量
   */
  clear(): void {
    this.marks.clear()
    this.measures.clear()
  }

  /**
   * 记录性能指标到控制台
   */
  log(): void {
    const measures = this.getAllMeasures()
    console.table(measures)
  }
}

/**
 * 全局性能监控实例
 */
export const performanceMonitor = new PerformanceMonitor()

/**
 * Web Worker 管理器
 */
export class WorkerManager {
  private workers: Map<string, Worker> = new Map()

  /**
   * 创建或获取 Worker
   * @param key - Worker 键名
   * @param workerFn - Worker 函数
   * @returns Worker 实例
   */
  getWorker(key: string, workerFn: () => Worker): Worker {
    if (!this.workers.has(key)) {
      this.workers.set(key, workerFn())
    }
    return this.workers.get(key)!
  }

  /**
   * 终止并移除 Worker
   * @param key - Worker 键名
   */
  terminateWorker(key: string): void {
    const worker = this.workers.get(key)
    if (worker) {
      worker.terminate()
      this.workers.delete(key)
    }
  }

  /**
   * 终止所有 Worker
   */
  terminateAll(): void {
    this.workers.forEach((worker) => worker.terminate())
    this.workers.clear()
  }
}

/**
 * 全局 Worker 管理器实例
 */
export const workerManager = new WorkerManager()

/**
 * 代码分割辅助函数
 * @param componentLoader - 组件加载器
 * @returns 加载状态和组件
 */
export const useCodeSplit = <P extends object>(
  componentLoader: () => Promise<{ default: React.ComponentType<P> }>
) => {
  const [component, setComponent] = React.useState<React.ComponentType<P> | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    componentLoader()
      .then((module) => {
        setComponent(() => module.default)
        setLoading(false)
      })
      .catch((err) => {
        setError(err as Error)
        setLoading(false)
      })
  }, [componentLoader])

  return { component, loading, error }
}