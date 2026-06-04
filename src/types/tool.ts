export interface RecommendedTool {
  id: string
  name: string
  description: string
  icon: string
  svgIcon?: string
  category: string
  tags: string[]
  url: string
  features?: string[]
  stats?: {
    stars: number
    forks: number
    usedBy: number
    version: string
    lastUpdated: string
    downloads?: number
    openIssues?: number
  }
}

export interface CategoryTree {
  id: string
  name: string
  description: string
  icon: string
  count: number
  children?: CategoryTree[]
}

export interface Folder {
  id: string
  name: string
  count?: number
}

export interface ToolData {
  name: string
  url: string
  description: string
  logo: string
  category: string
  subCategory: string
  githubUrl: string
  detail: string
  tags: string
}
