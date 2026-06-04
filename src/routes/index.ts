import { lazy } from 'react'

export interface RouteConfig {
  path: string
  element: React.ComponentType
  title?: string
}

export const routes = {
  recommended: {
    path: '/',
    element: lazy(() => import('@/pages/recommended')),
    title: '推荐工具',
  },
  my: {
    path: '/',
    element: lazy(() => import('@/pages/my')),
    title: '我的收藏',
  },
  tool: {
    path: '/tool/:toolId',
    element: lazy(() => import('@/pages/tool')),
    title: '工具详情',
  },
  search: {
    path: '/search',
    element: lazy(() => import('@/pages/search')),
    title: '搜索结果',
  },
  profile: {
    path: '/profile',
    element: lazy(() => import('@/pages/profile').then(m => ({ default: m.default }))),
    title: '个人中心',
  },
}

export const routePaths = {
  home: '/',
  tool: '/tool/:toolId',
  search: '/search',
  profile: '/profile',
}
