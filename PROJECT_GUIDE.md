# 前端工具库项目文档

## 📋 项目介绍
这是一个纯前端实现的开发者工具库，包含12个实用的开发工具，全部无需后端服务，可直接部署到GitHub Pages，支持离线使用，保护用户隐私。

### 🛠️ 技术栈
- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **样式方案**: 自定义SCSS + CSS Module（组件级样式，已完全移除Tailwind CSS依赖）
- **路由**: React Router DOM v7
- **工程化**: ESLint + Prettier
- **图标**: Lucide React
- **本地存储**: localStorage（实现收藏、喜爱、自定义文件夹数据持久化）

---

## 📁 项目文件结构说明

### 🔧 根目录配置文件详解

#### 1. `.eslintrc.cjs`
**作用**: ESLint代码校验规则配置文件
**详细说明**:
- 定义了JavaScript/TypeScript/React代码的校验规则
- 集成了Prettier的规则，避免代码风格冲突
- 核心规则：
  - 禁止未使用的变量（警告级别，不阻断编译）
  - 不需要在JSX文件中导入React（React 17+特性）
  - Prettier格式错误会当做ESLint错误抛出
  - React Hooks使用规则校验

#### 2. `.gitignore`
**作用**: Git忽略文件配置
**详细说明**:
- 定义了哪些文件不需要提交到Git仓库
- 常见忽略内容：
  - `node_modules/`：第三方依赖包，不需要提交
  - `dist/`：编译打包后的产物
  - `.vscode/`：编辑器配置（除了推荐插件配置）
  - 日志文件、本地缓存文件、系统临时文件

#### 3. `.lintstagedrc`
**作用**: Git提交前校验配置
**详细说明**:
- 配置Git提交时只校验本次修改的文件，提升校验速度
- 规则：
  - 对修改的JS/TS/JSX/TSX文件：先自动修复ESLint错误，再用Prettier格式化
  - 对修改的JSON/MD/CSS文件：直接用Prettier格式化
- 配合Husky使用，在代码提交前自动执行

#### 4. `.prettierignore`
**作用**: Prettier格式化忽略文件
**详细说明**:
- 定义哪些文件不需要Prettier自动格式化
- 当前配置忽略：dist目录、node_modules目录、所有Markdown文件

#### 5. `.prettierrc`
**作用**: Prettier代码格式化规则配置
**详细说明**:
- 统一团队代码风格，避免格式差异
- 核心规则：
  - 不使用分号（semi: false）
  - 使用单引号（singleQuote: true）
  - 缩进2个空格（tabWidth: 2）
  - 行尾保留逗号（trailingComma: "es5"）
  - 单行最大长度100字符（printWidth: 100）

#### 6. `eslint.config.js`
**作用**: ESLint新版扁平化配置文件
**详细说明**:
- Vite官方模板默认生成的ESLint配置，和`.eslintrc.cjs`是新旧两种配置格式
- 目前项目主要使用`.eslintrc.cjs`，后续可以逐步迁移到这个新格式

#### 7. `index.html`
**作用**: 项目入口HTML文件
**详细说明**:
- 浏览器访问项目时第一个加载的文件
- 定义了页面标题、meta标签、视口配置
- 引入了入口TS文件`/src/main.tsx`
- 根DOM节点`<div id="root"></div>`，所有React组件都会挂载到这个节点上

#### 8. `package.json`
**作用**: 项目依赖和脚本配置文件
**详细说明**:
- 项目基本信息：名称、版本号
- **scripts字段**：定义可执行的命令
  - `npm run dev`：启动本地开发服务器
  - `npm run build`：生产环境编译打包
  - `npm run lint`：运行ESLint校验所有代码
  - `npm run preview`：预览打包后的产物
- **dependencies字段**：生产环境依赖包（运行时需要用到的库）
- **devDependencies字段**：开发环境依赖包（只在开发时用到的工具）

#### 9. `package-lock.json`
**作用**: 依赖版本锁定文件
**详细说明**:
- 记录了所有依赖包的精确版本号和下载地址
- 保证团队所有人安装的依赖版本完全一致，避免"本地能运行，线上跑不起来"的问题
- 这个文件是自动生成的，不需要手动修改

#### 10. `postcss.config.js`
**作用**: PostCSS配置文件
**详细说明**:
- PostCSS是一个CSS处理工具，可以对CSS做各种转换
- 当前配置了两个插件：
  - `tailwindcss`：处理Tailwind的语法，转换成普通CSS
  - `autoprefixer`：自动给CSS属性加浏览器前缀，兼容不同浏览器

#### 11. `README.md`
**作用**: 项目说明文档
**详细说明**:
- 默认是Vite模板生成的说明文档
- 后续可以替换成你自己项目的介绍、功能说明、使用方法、部署指南等内容
- GitHub上打开项目时首先展示的就是这个文件

#### 12. `tailwind.config.js`
**作用**: Tailwind CSS配置文件
**详细说明**:
- 自定义Tailwind的行为和主题
- 核心配置：
  - `content`：指定哪些文件需要扫描Tailwind类名，没有提到的文件里的Tailwind类不会被编译
  - `darkMode: 'class'`：启用类名控制的暗黑模式，通过给html标签加`dark`类来切换暗黑模式
  - `theme`：可以自定义颜色、字体、间距等主题配置
  - `plugins`：可以安装Tailwind插件扩展功能

#### 13. `tsconfig.json`
**作用**: TypeScript主配置文件
**详细说明**:
- TypeScript项目的根配置文件，引用了两个子配置文件
- 采用项目引用的方式，分别配置前端应用代码和Node.js环境代码（vite.config.ts）

#### 14. `tsconfig.app.json`
**作用**: 前端应用TypeScript配置
**详细说明**:
- 针对`src/`目录下的前端代码的TS配置
- 核心配置：
  - `target: ES2022`：编译后代码的目标JS版本
  - `strict: true`：开启严格类型检查，所有变量必须有明确类型
  - `jsx: react-jsx`：支持JSX语法，不需要导入React
  - 已配置路径别名`@/*`指向`src/`目录，导入文件可以不用写冗长的相对路径
  - 各种代码质量检查规则，避免常见错误

#### 15. `tsconfig.node.json`
**作用**: Node.js环境TypeScript配置
**详细说明**:
- 针对`vite.config.ts`这类Node.js环境运行的配置文件的TS配置
- 和前端配置区分开，因为Node.js环境和浏览器环境支持的API不同

#### 16. `vite.config.ts`
**作用**: Vite构建工具配置文件
**详细说明**:
- 配置Vite的行为、插件、构建选项等
- 当前配置：
  - 启用React插件，支持React的热更新
  - 启用React Compiler（React官方的编译优化工具，提升运行性能）
- 后续可以在这里配置代理、路径别名、构建优化等

---

### 📂 src目录文件说明

#### 1. `src/main.tsx`
**作用**: 项目入口TS文件
**详细说明**:
- React应用的入口，把根组件App挂载到HTML的root节点上
- 是整个应用的执行起点

#### 2. `src/App.tsx`
**作用**: 根组件
**详细说明**:
- 整个应用的最顶层组件
- 配置了路由系统、全局布局
- 定义了所有路由规则：
  - 推荐页路径`/`对应Recommended组件
  - 我的页面路径`/my`对应MyPage组件
- 全局状态管理：收藏、喜爱、自定义文件夹数据均在此维护，持久化到localStorage

#### 3. `src/assets/styles/`
**作用**: 全局样式目录
**详细说明**:
- 所有全局样式统一存放在这里，包含：
  - `global.css`/`global.scss`：全局通用样式
  - `App.css`：根组件样式
  - `layout.css`：布局相关样式
  - `header.css`：头部导航样式
  - `tools.css`：工具页面通用样式
- 避免分散的全局样式文件，统一管理更清晰

#### 4. `src/index.css`
**作用**: 全局样式入口文件
**详细说明**:
- 引入Tailwind的三个核心指令：`@tailwind base`、`@tailwind components`、`@tailwind utilities`
- 全局样式重置：统一浏览器默认样式，设置全局字体

#### 5. `src/assets/`
**作用**: 静态资源目录
**详细说明**:
- 分类存放各类静态资源：
  - `icons/`：SVG图标文件
  - `images/`：图片资源
  - `styles/`：全局样式文件
- 默认有一个React的logo svg，可以删除替换成你自己的资源

#### 6. `src/components/`
**作用**: 全局公共组件目录
**详细说明**:
- 分类存放可复用的公共组件：
  - `layout/`：存放布局组件，比如Header（头部导航）、Layout（全局布局容器）
  - `AddToFolderModal`：收藏到文件夹弹窗组件
  - `ConfirmModal`：确认弹窗组件
  - `CreateFolderModal`：新建文件夹弹窗组件
  - `SubmitToolModal`：提交工具弹窗组件
  - `Message`：全局消息提示组件
  - `LazyImage`：图片懒加载组件
  - `ErrorBoundary`：错误边界组件

#### 7. `src/pages/`
**作用**: 页面组件目录
**详细说明**:
- `recommended/`：推荐页组件，展示所有工具列表、分类筛选、搜索功能
  - `components/Sidebar`：左侧分类侧边栏
  - `components/ToolCard`：工具卡片组件
  - `components/ToolCard/SkeletonCard`：加载骨架屏组件
- `my/`：我的页面组件，展示个人收藏、喜爱的工具、自定义文件夹管理
  - 支持文件夹级别的收藏管理
  - 支持收藏、喜爱状态切换

#### 8. `src/constants/`
**作用**: 常量配置目录
**详细说明**:
- 存放所有静态常量数据：
  - `categoryTree.ts`：工具分类配置
  - `recommendedTools.ts`：推荐工具列表数据
- 静态数据和业务逻辑分离

#### 9. `src/types/`
**作用**: TypeScript类型定义目录
**详细说明**:
- `tool.ts`：定义了工具的类型、分类，以及所有工具的配置列表
- 所有通用类型定义统一存放在这里

#### 10. `src/hooks/`
**作用**: 自定义React Hooks目录
**详细说明**:
- 存放可复用的自定义Hooks：
  - `useMessage`：全局消息提示Hook
- 实现逻辑复用，减少组件代码冗余

#### 11. `src/utils/`
**作用**: 通用工具函数目录
**详细说明**:
- `format.ts`：通用格式化工具函数（数字格式化、复制到剪贴板等）
- `modal.ts`：弹窗相关工具函数
- `request.ts`：请求工具函数
- `validation.ts`：表单校验工具函数
- 其他通用工具函数统一存放

---

## 📝 开发规范
1. 所有新功能都在feature分支开发，开发完成后合并到main分支
2. 代码提交前会自动运行ESLint和Prettier校验，不通过无法提交
3. 组件名使用大驼峰命名法，文件名和组件名保持一致
4. TypeScript类型定义要完整，禁止使用`any`类型

---

## 🚀 部署指南
1. 运行`npm run build`编译项目，打包产物会生成在`dist/`目录下
2. 把`dist/`目录的内容部署到GitHub Pages、Vercel、Netlify等静态托管平台即可
3. 不需要后端服务，纯静态文件就能运行
