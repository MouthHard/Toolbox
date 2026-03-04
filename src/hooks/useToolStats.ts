import { useMemo } from 'react'
import type { RecommendedTool } from '../types/tool'

interface ToolStats {
  stars: number
  forks: number
  usedBy: number
  version: string
  lastUpdated: string
  downloads: number | undefined
  openIssues: number
  openSource: boolean
}

export const useToolStats = (tool: RecommendedTool): ToolStats => {
  return useMemo(() => {
    // 如果工具已有真实stats数据，优先使用
    if (tool.stats) {
      return {
        stars: tool.stats.stars,
        forks: tool.stats.forks,
        usedBy: tool.stats.usedBy,
        version: tool.stats.version,
        lastUpdated: tool.stats.lastUpdated,
        downloads: tool.stats.downloads,
        openIssues: tool.stats.openIssues || 0,
        openSource: true
      }
    }

    // 用工具ID生成伪随机数种子
    const seed = tool.id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0)
    const random = (min: number, max: number) => {
      const x = Math.sin(seed) * 10000
      const rand = x - Math.floor(x)
      return Math.floor(rand * (max - min + 1)) + min
    }

    const versions = ['1.0.0', '1.2.5', '2.0.0', '2.1.3', '3.0.0', '1.8.7']
    const updateTimes = ['1周前', '2周前', '1个月前', '3个月前', '半年前', '1年前']

    return {
      stars: random(1000, 50000),
      forks: random(200, 10000),
      usedBy: random(50000, 1000000),
      version: versions[seed % versions.length],
      lastUpdated: updateTimes[seed % updateTimes.length],
      downloads: random(10000, 1000000),
      openIssues: random(10, 500),
      openSource: random(0, 10) > 3,
    }
  }, [tool.id, tool.stats])
}
