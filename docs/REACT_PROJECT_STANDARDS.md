# React 项目开发规范

> 本规范基于阿里巴巴、字节跳动、腾讯等大厂 React 开发规范整理，适用于中大型 React 项目开发。

## 目录

1. [项目结构规范](#一项目结构规范)
2. [组件设计规范](#二组件设计规范)
3. [Hooks 规范](#三hooks-规范)
4. [性能优化规范](#四性能优化规范)
5. [错误处理规范](#五错误处理规范)
6. [安全与可访问性](#六安全与可访问性)
7. [命名规范](#七命名规范)
8. [代码风格规范](#八代码风格规范)
9. [TypeScript 规范](#九typescript-规范)
10. [Git 提交规范](#十git-提交规范)

---

## 一、项目结构规范

### 1.1 目录组织原则

```
src/
├── assets/              # 静态资源
│   ├── icons/          # 图标资源
│   ├── images/          # 图片资源
│   └── styles/          # 全局样式
├── components/          # 组件（按功能模块组织）
│   ├── common/          # 通用组件
│   ├── layout/          # 布局组件
│   └── feature/          # 功能组件
├── constants/          # 常量定义
├── hooks/              # 自定义 Hooks
├── pages/              # 页面组件
├── services/          # 业务逻辑层（建议新增）
├── store/             # 状态管理（建议新增）
├── types/             # TypeScript 类型定义
├── utils/             # 工具函数
├── App.tsx
└── main.tsx
```

### 1.2 文件组织规则

- **组件文件**：每个组件放在独立文件夹，入口为 `index.tsx`
- **样式文件**：组件样式文件与组件同目录，如 `Button/index.scss`
- **测试文件**：测试文件与组件同目录，如 `Button/index.test.tsx`
- **常量文件**：相关常量集中管理，如分类、配置等

### 1.3 目录划分标准

| 目录 | 说明 | 示例 |
|------|------|------|
| `components/common` | 通用组件，项目各处可用 | Button, Modal, Input |
| `components/layout` | 布局组件 | Header, Sidebar, Footer |
| `components/feature` | 业务组件，仅特定功能使用 | UserCard, ToolList |
| `pages` | 页面级组件，对应路由 | Home, Profile, Settings |
| `hooks` | 自定义 Hook，可复用逻辑 | useAuth, useFetch |
| `utils` | 纯函数工具 | formatDate, validation |
| `constants` | 静态配置 | categories, config |

---

## 二、组件设计规范

### 2.1 组件分类

#### 展示组件（Presentational Components）
- **特点**：纯 UI，仅通过 props 接收数据
- **优化**：使用 `React.memo` 包装
- **示例**：
```tsx
// ✅ 推荐：使用 React.memo
const Button: React.FC<ButtonProps> = memo(({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>
})

// ✅ 推荐：添加 displayName
Button.displayName = 'Button'
```

#### 容器组件（Container Components）
- **特点**：管理数据和逻辑，组合展示组件
- **示例**：
```tsx
const UserProfile: React.FC = () => {
  const { user, loading } = useUser()
  return loading ? <Skeleton /> : <UserCard user={user} />
}
```

#### 页面组件（Page Components）
- **位置**：`pages/` 目录
- **特点**：处理路由参数、权限校验、加载状态
- **示例**：
```tsx
const ProfilePage: React.FC = () => {
  const { userId } = useParams()
  const { user, loading } = useUser(userId)

  if (loading) return <PageSkeleton />
  if (!user) return <NotFound />

  return (
    <PageContainer>
      <UserProfile user={user} />
    </PageContainer>
  )
}
```

### 2.2 Props 设计原则

#### ✅ 必传 vs 可选
```tsx
interface ButtonProps {
  children: React.ReactNode        // 必传
  onClick?: () => void             // 可选
  variant?: 'primary' | 'secondary' // 可选
  disabled?: boolean               // 可选
  size?: 'small' | 'medium' | 'large'
}
```

#### ✅ 避免 props 透传
```tsx
// ❌ 不推荐：props 透传
<ChildComponent {...props} />

// ✅ 推荐：明确传递需要的属性
<ChildComponent
  name={props.name}
  age={props.age}
  onChange={props.handleChange}
/>
```

#### ✅ 使用 children 而非 render props（简单场景）
```tsx
// ✅ 推荐
<Card>
  <Title>标题</Title>
  <Content>内容</Content>
</Card>

// ⚠️ 仅复杂场景使用 render props
<Modal render={(onClose) => <Form onClose={onClose} />} />
```

### 2.3 组件复用原则

#### ✅ 组合优于继承
```tsx
// ✅ 推荐：组合模式
const Card = ({ children, className }) => (
  <div className={`card ${className}`}>{children}</div>
)

// 使用
<Card>
  <Card.Header>标题</Card.Header>
  <Card.Body>内容</Card.Body>
</Card>
```

#### ✅ 自定义 Hook 复用逻辑
```tsx
// ✅ 推荐：自定义 Hook 封装逻辑
const useUserData = (userId: string) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false))
  }, [userId])

  return { user, loading }
}
```

---

## 三、Hooks 规范

### 3.1 Hooks 调用规则

#### ✅ 只在顶层调用 Hooks
```tsx
// ❌ 错误：在条件、循环中调用
if (isLoggedIn) {
  const user = useUser() // 错误！
}

// ✅ 正确：在组件顶层调用
const Profile = () => {
  const user = useUser()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // ...
}
```

#### ✅ 只在 React 函数中调用
```tsx
// ❌ 错误：普通函数中调用
const handleClick = () => {
  useUser() // 错误！
}

// ✅ 正确：组件或自定义 Hook 中调用
const useUserData = () => {
  const user = useUser() // 正确
  // ...
}
```

### 3.2 useState 使用规范

#### ✅ 避免不必要的状态
```tsx
// ❌ 不推荐：可计算的值放入 state
const [fullName, setFullName] = useState('')
const [lastName, setLastName] = useState('')

// ✅ 推荐：计算得到
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const fullName = `${firstName} ${lastName}`
```

#### ✅ 状态更新批量处理
```tsx
// ❌ 不推荐：多次 setState
setName('John')
setAge(25)
setCity('Beijing')

// ✅ 推荐：使用 setState 函数形式
setUser(prev => ({
  ...prev,
  name: 'John',
  age: 25,
  city: 'Beijing'
}))
```

### 3.3 useEffect 规范

#### ✅ 完整依赖数组
```tsx
// ❌ 错误：遗漏依赖
useEffect(() => {
  fetchData(id)
}, [id]) // ✅ 正确

// ❌ 错误：依赖数组包含函数（函数需用 useCallback）
useEffect(() => {
  handleData(data)
}, [data, handleData]) // handleData 每次渲染都变化

// ✅ 正确：函数用 useCallback 包裹
const handleData = useCallback((data) => {
  // 处理数据
}, [])
useEffect(() => {
  handleData(data)
}, [data, handleData])
```

#### ✅ 副作用清理
```tsx
// ✅ 推荐：清理副作用
useEffect(() => {
  const subscription = subscribe(id, handler)
  return () => subscription.unsubscribe() // 清理
}, [id])

// ✅ 推荐：清除定时器
useEffect(() => {
  const timer = setInterval(() => tick(), 1000)
  return () => clearInterval(timer)
}, [])
```

### 3.4 useMemo / useCallback 规范

#### ✅ useMemo 缓存计算结果
```tsx
// ✅ 推荐：缓存复杂计算
const sortedList = useMemo(() => {
  return list
    .filter(item => item.active)
    .sort((a, b) => b.score - a.score)
}, [list])

// ✅ 推荐：避免对象重复创建
const config = useMemo(() => ({
  timeout: 5000,
  retries: 3
}), [])
```

#### ✅ useCallback 缓存回调函数
```tsx
// ✅ 推荐：传递给子组件的函数
const handleClick = useCallback((id) => {
  setData(id)
}, [])

// ✅ 推荐：作为 useEffect 依赖的函数
const fetchData = useCallback(async (id) => {
  const res = await api.get(id)
  setData(res)
}, [])

useEffect(() => {
  fetchData(userId)
}, [userId, fetchData])
```

#### ⚠️ 不要滥用
```tsx
// ❌ 不推荐：简单计算不需要 useMemo
const fullName = useMemo(() => firstName + lastName, [firstName, lastName])

// ✅ 推荐：直接计算
const fullName = `${firstName} ${lastName}`

// ❌ 不推荐：普通变量不需要 useCallback
const handleChange = useCallback((e) => setValue(e.target.value), [])
```

### 3.5 useContext 规范

#### ✅ 使用 useMemo 缓存 value
```tsx
// ✅ 推荐：缓存 Provider value
const UserContext = createContext(null)

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const value = useMemo(() => ({
    user,
    setUser
  }), [user, setUser])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
```

---

## 四、性能优化规范

### 4.1 组件优化

#### ✅ React.memo 优化展示组件
```tsx
const UserCard: React.FC<UserCardProps> = memo(({ user, onEdit }) => {
  return (
    <div className="user-card">
      <Avatar src={user.avatar} />
      <span>{user.name}</span>
      <button onClick={() => onEdit(user.id)}>编辑</button>
    </div>
  )
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.user.id === nextProps.user.id &&
         prevProps.user.name === nextProps.user.name
})
```

#### ✅ 懒加载路由和组件
```tsx
// ✅ 推荐：路由懒加载
const Home = lazy(() => import('./pages/Home'))
const Profile = lazy(() => import('./pages/Profile'))

// ✅ 推荐：Suspense 包裹
<Suspense fallback={<Skeleton />}>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</Suspense>
```

### 4.2 列表渲染优化

#### ✅ 使用 key 而不是 index
```tsx
// ❌ 错误
{items.map((item, index) => <Item key={index} {...item} />)}

// ✅ 正确
{items.map(item => <Item key={item.id} {...item} />)}
```

#### ✅ 虚拟列表（长列表优化）
```tsx
// ✅ 推荐：大量数据使用虚拟列表
import { FixedSizeList } from 'react-window'

const List = ({ items }) => (
  <FixedSizeList
    height={400}
    itemCount={items.length}
    itemSize={50}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>{items[index].name}</div>
    )}
  </FixedSizeList>
)
```

### 4.3 图片优化

#### ✅ 图片懒加载
```tsx
// ✅ 推荐：使用 Intersection Observer
import LazyLoad from 'react-lazyload'

<LazyLoad height={200} once offset={100}>
  <img src={src} alt={alt} />
</LazyLoad>

// ✅ 推荐：原生 loading="lazy"
<img src={src} alt={alt} loading="lazy" />
```

#### ✅ 图片格式优化
```tsx
// ✅ 推荐：使用 WebP 格式
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt={alt} />
</picture>
```

### 4.4 代码分割

#### ✅ 按路由分割
```tsx
// ✅ 推荐：每个页面单独打包
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
```

#### ✅ 按组件分割
```tsx
// ✅ 推荐：大组件按需加载
const HeavyChart = lazy(() => import('./components/HeavyChart'))

{showChart && (
  <Suspense fallback={<ChartSkeleton />}>
    <HeavyChart data={data} />
  </Suspense>
)}
```

---

## 五、错误处理规范

### 5.1 Error Boundary

#### ✅ 组件级错误边界
```tsx
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 上报错误日志
    logError(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

#### ✅ 错误日志记录
```tsx
// ✅ 推荐：结构化错误日志
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
    },
    componentStack: errorInfo.componentStack,
    url: window.location.href,
    userAgent: navigator.userAgent,
  }
  console.error('[Error]', errorLog)
}
```

### 5.2 API 错误处理

#### ✅ 统一错误处理
```tsx
// ✅ 推荐：封装请求工具
const request = async <T>(url: string, config?: RequestConfig) => {
  try {
    const response = await fetch(url, config)
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText)
    }
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      // 处理 API 错误
      handleApiError(error)
    } else {
      // 处理网络错误
      handleNetworkError(error)
    }
    throw error
  }
}
```

#### ✅ 请求超时处理
```tsx
// ✅ 推荐：请求超时
const fetchWithTimeout = async (url: string, timeout = 10000) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('请求超时')
    }
    throw error
  }
}
```

### 5.3 表单验证

#### ✅ 前端验证
```tsx
// ✅ 推荐：实时验证 + 提交时验证
const validateForm = (values: FormValues): Errors => {
  const errors: Errors = {}

  if (!values.email) {
    errors.email = '邮箱不能为空'
  } else if (!isValidEmail(values.email)) {
    errors.email = '请输入有效的邮箱地址'
  }

  return errors
}
```

---

## 六、安全与可访问性

### 6.1 可访问性（a11y）

#### ✅ 语义化标签
```tsx
// ❌ 错误：滥用 div
<div className="button" onClick={handleClick}>点击</div>

// ✅ 正确：使用语义标签
<button onClick={handleClick}>点击</button>
```

#### ✅ ARIA 属性
```tsx
// ✅ 推荐：按钮
<button
  type="button"
  aria-label="关闭弹窗"
  aria-expanded={isOpen}
  onClick={onClose}
>
  <X />
</button>

// ✅ 推荐：模态框
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">标题</h2>
</div>

// ✅ 推荐：图片
<img
  src={src}
  alt={alt}
  aria-describedby="description-id"
/>
```

#### ✅ 键盘导航
```tsx
// ✅ 推荐：支持 Tab 导航
<div
  role="listbox"
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
  {options.map(option => (
    <div
      key={option.id}
      role="option"
      aria-selected={selected === option.id}
    >
      {option.label}
    </div>
  ))}
</div>
```

### 6.2 安全性

#### ✅ XSS 防护
```tsx
// ✅ 推荐：React 自动转义
const UserInput = ({ content }) => (
  <div>{content}</div> // 自动转义 HTML
)

// ⚠️ 谨慎使用 dangerouslySetInnerHTML
const UnsafeContent = ({ html }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
)
```

#### ✅ CSRF 防护
```tsx
// ✅ 推荐：验证请求来源
const csrfToken = getCsrfToken()

fetch(url, {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
    'Content-Type': 'application/json',
  },
  credentials: 'include', // 跨域请求携带 cookie
})
```

---

## 七、命名规范

### 7.1 组件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `UserCard.tsx` |
| 组件名 | PascalCase | `const UserCard` |
| Props 接口 | PascalCase + Props | `interface UserCardProps` |
| 展示组件 | 功能 + 描述性名词 | `UserAvatar`, `ToolCard` |
| 容器组件 | 页面/功能 + Container | `UserContainer` |

### 7.2 变量命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 普通变量 | camelCase | `userName`, `isLoading` |
| 常量 | UPPER_SNAKE_CASE | `MAX_COUNT`, `API_BASE_URL` |
| 布尔值 | is/has/should/can + 名词 | `isActive`, `hasPermission` |
| 数组 | 复数名词 | `users`, `items`, `tools` |
| 函数 | handle + 动作 | `handleClick`, `handleSubmit` |
| 回调函数 | on + 事件 | `onChange`, `onSubmit` |

### 7.3 Hooks 命名

- 必须以 `use` 开头
- 驼峰命名
- 示例：`useUser`, `useLocalStorage`, `useDebounce`

### 7.4 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserCard.tsx` |
| 工具函数 | camelCase 或 kebab-case | `formatDate.ts`, `api-client.ts` |
| 样式文件 | 与组件同名 | `UserCard.scss` |
| 测试文件 | 组件名 + .test | `UserCard.test.tsx` |
| 类型定义 | 描述性名词 | `tool.ts`, `user.ts` |

---

## 八、代码风格规范

### 8.1 导入顺序

```tsx
// 1. React 相关
import React, { useState, useEffect } from 'react'

// 2. 第三方库
import { BrowserRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// 3. 类型定义
import type { User } from '@/types/user'
import type { AxiosRequestConfig } from 'axios'

// 4. 组件导入
import Button from '@/components/common/Button'
import Header from '@/components/layout/Header'

// 5. 工具函数
import { formatDate } from '@/utils/format'
import { validateEmail } from '@/utils/validation'

// 6. 常量/配置
import { MAX_COUNT } from '@/constants/config'

// 7. 样式导入
import '@/styles/button.scss'
```

### 8.2 JSX 规范

#### ✅ 使用显式判断
```tsx
// ❌ 不推荐
{user && <UserCard user={user} />}

// ✅ 推荐
{user ? <UserCard user={user} /> : null}

// ✅ 推荐：明确条件
{isLoading && <Skeleton />}
{error && <ErrorMessage error={error} />}
```

#### ✅ 使用 Fragment 减少 DOM 节点
```tsx
// ❌ 不推荐：多余 div
<div>
  <Header />
  <Content />
</div>

// ✅ 推荐
<>
  <Header />
  <Content />
</>
```

#### ✅ 事件处理
```tsx
// ✅ 推荐：使用箭头函数或 bind
<button onClick={() => handleClick(id)}>删除</button>
<button onClick={handleClick.bind(null, id)}>删除</button>

// ✅ 推荐：所有按钮添加 type
<button type="button" onClick={onCancel}>取消</button>
<button type="submit" form="user-form">提交</button>
```

### 8.3 注释规范

#### ✅ 组件注释
```tsx
/**
 * 用户卡片组件
 * 展示用户基本信息，包含头像、名称和操作按钮
 *
 * @param user - 用户信息
 * @param onEdit - 编辑回调
 * @param onDelete - 删除回调
 */
const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  // ...
}
```

#### ✅ 函数注释
```tsx
/**
 * 格式化日期为相对时间
 * @param date - 日期对象或时间戳
 * @returns 相对时间字符串，如 "1小时前"
 *
 * @example
 * formatRelativeTime(new Date()) // "刚刚"
 * formatRelativeTime(Date.now() - 3600000) // "1小时前"
 */
export const formatRelativeTime = (date: Date | number): string => {
  // ...
}
```

---

## 九、TypeScript 规范

### 9.1 类型定义

#### ✅ 使用 interface 定义对象类型
```tsx
// ✅ 推荐：interface
interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// ✅ 推荐：type 用于联合类型
type UserStatus = 'active' | 'inactive' | 'banned'

type Props = {
  children: React.ReactNode
  onClick?: () => void
}
```

#### ✅ 避免使用 any
```tsx
// ❌ 错误
const handleData = (data: any) => {
  console.log(data.name)
}

// ✅ 正确
interface Data {
  name: string
  age: number
}
const handleData = (data: Data) => {
  console.log(data.name)
}

// ✅ 如果类型未知，使用 unknown
const parseJSON = (json: string): unknown => {
  return JSON.parse(json)
}
```

### 9.2 类型导入

#### ✅ 使用 type 导入（类型安全）
```tsx
// ✅ 推荐：只导入类型
import type { User, UserProps } from '@/types/user'

// ✅ 推荐：值和类型同时导入
import { useState } from 'react'
import type { User } from '@/types/user'
```

### 9.3 泛型使用

#### ✅ 合理使用泛型
```tsx
// ✅ 推荐：通用 API 响应类型
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

// ✅ 推荐：通用列表类型
interface ListResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// 使用
const response = await get<ListResponse<User>>('/users')
```

---

## 十、Git 提交规范

### 10.1 Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 10.2 Type 类型

| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复 bug |
| docs | 文档更新 |
| style | 代码格式（不影响功能） |
| refactor | 重构（不是修复也不是新功能） |
| perf | 性能优化 |
| test | 测试相关 |
| chore | 构建/工具相关 |

### 10.3 示例

```
feat(user): 添加用户登录功能

实现邮箱密码登录，集成登录状态管理

- 添加登录表单组件
- 实现登录 API 调用
- 添加错误处理和加载状态

Closes #123
```

---

## 附录：最佳实践清单

### 开发前
- [ ] 阅读并理解项目规范文档
- [ ] 了解现有组件库和工具函数
- [ ] 查看相关页面的设计和交互

### 开发中
- [ ] 遵循命名规范
- [ ] 组件按规范分类（展示/容器/页面）
- [ ] 使用 TypeScript 类型定义
- [ ] 添加必要的注释
- [ ] 考虑性能影响
- [ ] 处理错误和边界情况
- [ ] 确保可访问性

### 开发后
- [ ] 运行 ESLint 检查
- [ ] 运行 Prettier 格式化
- [ ] 运行测试
- [ ] 自检代码是否符合规范
- [ ] 提交前本地验证功能正常

---

## 参考资料

- [React 官方文档](https://react.dev)
- [TypeScript 官方文档](https://www.typescriptlang.org)
- [Airbnb JavaScript 风格指南](https://github.com/airbnb/javascript)
- [Google TypeScript 风格指南](https://google.github.io/styleguide/tsguide.html)
- [WAI-ARIA 实践指南](https://www.w3.org/WAI/ARIA/apg/)

---

**版本**: v1.0.0
**更新日期**: 2024年
**维护者**: 前端团队
