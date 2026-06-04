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

const VERSIONS = ['1.0.0', '1.2.5', '2.0.0', '2.1.3', '3.0.0', '1.8.7']
const UPDATE_TIMES = ['1周前', '2周前', '1个月前', '3个月前', '半年前', '1年前']

const generateSeed = (id: string): number => {
  return id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0)
}

const pseudoRandom = (seed: number, min: number, max: number): number => {
  const x = Math.sin(seed) * 10000
  const rand = x - Math.floor(x)
  return Math.floor(rand * (max - min + 1)) + min
}

export const useToolStats = (tool: RecommendedTool): ToolStats => {
  return useMemo(() => {
    if (tool.stats) {
      return {
        stars: tool.stats.stars,
        forks: tool.stats.forks,
        usedBy: tool.stats.usedBy,
        version: tool.stats.version,
        lastUpdated: tool.stats.lastUpdated,
        downloads: tool.stats.downloads,
        openIssues: tool.stats.openIssues || 0,
        openSource: true,
      }
    }

    const seed = generateSeed(tool.id)

    return {
      stars: pseudoRandom(seed, 1000, 50000),
      forks: pseudoRandom(seed + 1, 200, 10000),
      usedBy: pseudoRandom(seed + 2, 50000, 1000000),
      version: VERSIONS[seed % VERSIONS.length],
      lastUpdated: UPDATE_TIMES[seed % UPDATE_TIMES.length],
      downloads: pseudoRandom(seed + 3, 10000, 1000000),
      openIssues: pseudoRandom(seed + 4, 10, 500),
      openSource: pseudoRandom(seed + 5, 0, 10) > 3,
    }
  }, [tool.id, tool.stats])
}
