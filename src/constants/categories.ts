export interface Category {
  name: string
  subCategories: string[]
}

export const categories: Category[] = [
  {
    name: '开发工具',
    subCategories: [
      '代码编辑器',
      '在线运行环境',
      '调试工具',
      '代码格式化',
      '编译构建',
      '包管理工具',
      '主流浏览器',
      '开发插件',
      '性能分析',
      '抓包工具',
    ],
  },
  {
    name: '框架 & 组件',
    subCategories: ['前端框架', 'UI组件库', '后端框架', '移动开发框架', '小程序框架'],
  },
  {
    name: '设计 & 素材',
    subCategories: [
      'UI设计工具',
      '图标库',
      '插图素材',
      '配色工具',
      '原型设计',
      '字体资源',
      '设计系统',
    ],
  },
  {
    name: '后端 & 服务',
    subCategories: ['云服务', '数据库', 'API服务', '服务器', '消息队列', '缓存服务', '容器服务'],
  },
  {
    name: '学习 & 社区',
    subCategories: ['编程教程', '技术社区', '文档平台', '面试题库', '开源平台', '在线课程'],
  },
  {
    name: '效率工具',
    subCategories: [
      '协作工具',
      '笔记软件',
      '思维导图',
      '项目管理',
      '时间管理',
      '文档协作',
      '图表工具',
    ],
  },
]
