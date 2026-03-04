import type { RecommendedTool } from '../types/tool'

// 完整分类映射，支持精确筛选
export const categoryMap: Record<string, (tool: RecommendedTool) => boolean> = {
  // 父分类
  'dev-tools': (tool) => ['代码开发', '开发工具'].includes(tool.category),
  framework: (tool) => ['前端框架', '框架库'].includes(tool.category),
  design: (tool) => ['UI设计', '设计资源'].includes(tool.category),
  collaboration: (tool) => ['代码托管', '协作工具'].includes(tool.category),
  api: (tool) => ['API工具', '数据服务'].includes(tool.category),
  learning: (tool) => ['学习资源', '文档教程'].includes(tool.category),
  productivity: (tool) => ['效率工具', '办公工具'].includes(tool.category),
  browser: (tool) => ['浏览器', '开发插件'].includes(tool.category),
  assets: (tool) => ['素材资源', '图片字体'].includes(tool.category),
  test: (tool) => ['测试工具', '部署平台'].includes(tool.category),
  community: (tool) => ['社区平台', '技术资讯'].includes(tool.category),

  // 子分类
  'dev-editor': (tool) => tool.category === '代码开发',
  'dev-online': (tool) => tool.category === '开发工具',
  'dev-debug': (tool) => tool.category === '开发工具' && tool.tags.includes('调试'),
  'dev-format': (tool) => tool.category === '开发工具' && tool.tags.includes('格式化'),
  'dev-build': (tool) => tool.category === '开发工具' && tool.tags.includes('构建'),
  'dev-package': (tool) => tool.category === '开发工具' && tool.tags.includes('包管理'),

  'framework-main': (tool) => tool.category === '前端框架',
  'framework-ui': (tool) => tool.category === '框架库' && tool.tags.includes('UI组件'),
  'framework-utils': (tool) => tool.category === '框架库' && tool.tags.includes('工具函数'),
  'framework-animation': (tool) => tool.category === '框架库' && tool.tags.includes('动画'),
  'framework-chart': (tool) => tool.category === '框架库' && tool.tags.includes('图表'),
  'framework-state': (tool) => tool.category === '框架库' && tool.tags.includes('状态管理'),

  'design-tool': (tool) => tool.category === 'UI设计',
  'design-icon': (tool) => tool.category === '设计资源' && tool.tags.includes('图标'),
  'design-color': (tool) => tool.category === '设计资源' && tool.tags.includes('配色'),
  'design-prototype': (tool) => tool.category === '设计资源' && tool.tags.includes('原型'),
  'design-system': (tool) => tool.category === '设计资源' && tool.tags.includes('设计系统'),
  'design-material': (tool) => tool.category === '设计资源' && tool.tags.includes('素材'),

  'collab-git': (tool) => tool.category === '代码托管',
  'collab-team': (tool) => tool.category === '协作工具' && tool.tags.includes('团队协作'),
  'collab-review': (tool) => tool.category === '协作工具' && tool.tags.includes('代码review'),
  'collab-cicd': (tool) => tool.category === '协作工具' && tool.tags.includes('CI/CD'),
  'collab-doc': (tool) => tool.category === '协作工具' && tool.tags.includes('文档协作'),

  'api-debug': (tool) => tool.category === 'API工具',
  'api-mock': (tool) => tool.category === '数据服务' && tool.tags.includes('Mock'),
  'api-db': (tool) => tool.category === '数据服务' && tool.tags.includes('数据库'),
  'api-cloud': (tool) => tool.category === '数据服务' && tool.tags.includes('云服务'),

  'learning-doc': (tool) => tool.category === '学习资源',
  'learning-tutorial': (tool) => tool.category === '文档教程' && tool.tags.includes('教程'),
  'learning-interview': (tool) => tool.category === '文档教程' && tool.tags.includes('面试'),
  'learning-blog': (tool) => tool.category === '文档教程' && tool.tags.includes('博客'),
  'learning-challenge': (tool) => tool.category === '文档教程' && tool.tags.includes('编程挑战'),

  'prod-note': (tool) => tool.category === '效率工具' && tool.tags.includes('笔记'),
  'prod-project': (tool) =>
    tool.category === '效率工具' &&
    tool.tags.some((tag: string) => ['项目管理', '任务管理', '企业协作', '团队沟通'].includes(tag)),
  'prod-mindmap': (tool) => tool.category === '效率工具' && tool.tags.includes('思维导图'),
  'prod-password': (tool) => tool.category === '效率工具' && tool.tags.includes('密码管理'),
  'prod-translate': (tool) => tool.category === '效率工具' && tool.tags.includes('翻译'),

  'browser-main': (tool) => tool.category === '浏览器',
  'browser-plugin': (tool) => tool.category === '开发插件' && tool.tags.includes('浏览器插件'),
  'browser-performance': (tool) => tool.category === '开发插件' && tool.tags.includes('性能分析'),
  'browser-proxy': (tool) => tool.category === '开发插件' && tool.tags.includes('抓包'),

  'assets-image': (tool) => tool.category === '素材资源' && tool.tags.includes('图片'),
  'assets-font': (tool) => tool.category === '素材资源' && tool.tags.includes('字体'),
  'assets-media': (tool) =>
    tool.category === '素材资源' && tool.tags.some((tag) => ['视频', '音频'].includes(tag)),
  'assets-3d': (tool) => tool.category === '素材资源' && tool.tags.includes('3D'),

  'test-unit': (tool) => tool.category === '测试工具' && tool.tags.includes('单元测试'),
  'test-e2e': (tool) => tool.category === '测试工具' && tool.tags.includes('E2E测试'),
  'test-deploy': (tool) => tool.category === '部署平台',
  'test-performance': (tool) => tool.category === '测试工具' && tool.tags.includes('性能监控'),

  'community-qa': (tool) => tool.category === '社区平台',
  'community-news': (tool) => tool.category === '技术资讯' && tool.tags.includes('资讯'),
  'community-job': (tool) => tool.category === '技术资讯' && tool.tags.includes('求职'),
  'community-event': (tool) => tool.category === '技术资讯' && tool.tags.includes('开源活动'),
}
