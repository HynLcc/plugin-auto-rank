# Teable 排名插件

一个 [Teable](https://teable.ai) 插件，为表格记录提供自动排名功能。

## 📺 功能演示

![功能演示 GIF](./image/20251120012132_rec_.gif)

## ✨ 功能特性

- 🏆 **多种排名方法** - 标准排名和密集排名算法
- 🎯 **字段映射** - 灵活的源字段和目标排名字段选择
- 📊 **分组排名** - 在特定分组内计算排名
- 🔧 **高级配置** - 排序方向、零值处理等
- 🎨 **主题支持** - 完整的明暗模式兼容，自动主题检测
- 🌍 **国际化** - 完整的 i18n 支持（英文/中文）
- 📱 **响应式设计** - 针对所有屏幕尺寸优化
- ⚡ **性能优化** - 使用 React Query 实现高效数据获取
- 🛡️ **错误处理** - 全面的错误报告和用户反馈
- 🔌 **Teable 集成** - 与 Teable 表格和字段的无缝集成

## 🛠️ 技术栈

### 核心框架
- **Next.js 14.2.14** - 带 App Router 的 React 全栈框架
- **React 18.2.0** - 现代化 React 功能的 UI 库
- **TypeScript 5** - 类型安全的 JavaScript 超集（启用严格模式）

### Teable 生态
- `@teable/sdk` - 插件桥接和 UI 配置
- `@teable/openapi` - API 客户端和类型定义
- `@teable/core` - 核心类型定义和工具
- `@teable/ui-lib` - Teable 官方 UI 组件库（基于 shadcn/ui）
- `@teable/next-themes` - 主题切换支持

### UI 和样式
- **Tailwind CSS 3.4.1** - 原子化 CSS 框架，使用 Teable UI 配置
- **Lucide React** - 现代化界面的图标库

### 状态管理和数据
- `@tanstack/react-query 4.36.1` - 服务端状态管理、缓存和同步
- `react-i18next 14.1.0` - 国际化框架
- `i18next 23.10.1` - 核心国际化库

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn
- 具有插件访问权限的 Teable 账户

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev -p 3001
```
访问 [http://localhost:3001](http://localhost:3001) 查看插件。

### 3. 构建生产版本
```bash
npm run build
```

### 4. 启动生产服务器
```bash
npm start
```

### 5. 代码质量检查
```bash
npm run lint          # 运行 ESLint
```

## 📁 项目结构

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # 主应用入口，包含 i18n 和主题设置
│   ├── Main.tsx                 # 主题和 QueryClient 集成
│   ├── layout.tsx               # 根布局组件
│   └── globals.css              # 全局样式和 CSS 变量
├── components/
│   ├── RankingPages.tsx         # 主排名界面组件
│   ├── ErrorBoundary.tsx        # 错误边界组件
│   ├── context/                 # React Context 提供者
│   │   ├── EnvProvider.tsx      # 环境变量注入
│   │   ├── I18nProvider.tsx     # 国际化提供者
│   │   └── types.ts             # TypeScript 类型定义
│   ├── ranking/                 # 排名特定组件
│   │   ├── ColumnSelector.tsx   # 字段选择组件
│   │   ├── GroupFieldSelector.tsx # 分组字段选择
│   │   ├── RankingConfig.tsx    # 排名配置 UI
│   │   ├── RankingExecutor.tsx  # 排名执行引擎
│   │   └── types.ts             # 排名类型定义
│   └── ui/                      # UI 工具组件
├── hooks/                       # 自定义 React Hooks
│   ├── useInitApi.ts           # API 初始化
│   ├── useFields.ts            # 字段数据获取
│   ├── useFieldMap.ts          # 字段映射工具
│   ├── useGlobalUrlParams.ts   # URL 参数管理
│   ├── useToast.ts             # Toast 通知
│   └── useAsyncError.ts        # 异步错误处理
├── lib/                         # 业务逻辑和工具
│   ├── RankingAlgorithms.ts    # 排名计算算法
│   └── rankRecord.ts           # 记录排名操作
├── types/                       # 全局类型定义
│   ├── field.ts                # 字段相关类型
│   └── index.ts                # 类型导出
├── locales/                     # 国际化文件
│   ├── en.json                 # 英文翻译
│   └── zh.json                 # 中文翻译
└── scripts/                     # 构建和优化脚本
```

## 🔧 配置

### 插件参数
插件通过 `EnvProvider.tsx` 从 URL 参数读取配置：

- `baseId` - Teable 基础标识符
- `pluginId` - 插件标识符
- `pluginInstallId` - 插件安装 ID
- `tableId` - 排名操作的目标表格
- `shareId`, `positionId`, `positionType` - UI 定位
- `lang`, `theme` - 本地化和主题设置

### 排名配置

插件支持以下排名配置：

#### 排名方法
- **标准排名**: `1, 2, 2, 4` - 标准竞争排名，有间隙
- **密集排名**: `1, 2, 2, 3` - 密集排名，无间隙

#### 零值处理
- **跳过零值**: 排名计算中忽略零值
- **包含零值**: 排名计算中包含零值

#### 分组
- **不分组**: 跨所有记录计算排名
- **基于分组**: 在指定分组内计算排名

## 🎨 样式和主题

### CSS 架构
- **CSS 变量** - 使用 HSL 颜色值的完整主题系统
- **响应式设计** - 移动优先的方法，带断点
- **组件隔离** - 自定义组件的作用域样式
- **暗色模式支持** - 自动主题检测和切换

### UI 组件
- **Shadcn/ui 组件** - 现代、可访问的 UI 组件
- **Teable UI 集成** - 与 Teable 设计系统保持一致
- **表单控件** - 排名配置的自定义表单元素

## 🌍 国际化

支持的语言：
- 英文 (en)
- 中文 (zh)

### 添加新语言
1. 在 `src/locales/[lang].json` 创建翻译文件
2. 更新 `I18nProvider.tsx` 资源配置
3. 向组件添加特定语言的内容

## 🔌 Teable 集成

### 插件桥接使用
```typescript
import { usePluginBridge } from '@teable/sdk';

const bridge = usePluginBridge();

// 监听配置变化
bridge.on('syncUIConfig', handleConfigChange);

// 获取临时令牌用于 API 调用
const token = await bridge.getSelfTempToken();
```

### API 集成
插件使用 Teable 的 OpenAPI，自动身份验证：
```typescript
import { openApi } from '@teable/openapi';

// 所有 API 调用都自动身份验证
const fields = await openApi.getFields(tableId);
const records = await openApi.getTableRecords(tableId, viewId);
```

## 🏆 排名算法

插件实现了两种排名算法：

### 标准排名
```typescript
// 示例: 数值 [10, 20, 20, 30] → 排名 [1, 2, 2, 4]
// 标准竞争排名，有间隙
```

### 密集排名
```typescript
// 示例: 数值 [10, 20, 20, 30] → 排名 [1, 2, 2, 3]
// 密集排名，无间隙
```

## 🚀 部署

### 构建过程
```bash
# 构建生产版本
npm run build
```

### 插件安装
1. 构建插件：`npm run build`
2. 部署到你的托管服务
3. 在 Teable 中配置正确的 URL 参数
4. 在 Teable 环境中测试插件功能

## 🧪 开发

### 代码质量
- **TypeScript 严格模式** - 完整类型安全启用
- **ESLint** - 代码质量和样式强制执行
- **Prettier** - 一致的代码格式化

### 性能功能
- **React Query** - 高效数据获取和缓存
- **React.memo** - 组件优化
- **useMemo/useCallback** - Hook 优化
- **代码分割** - 优化的包加载

## 🤝 贡献

我们欢迎贡献！请遵循以下步骤：

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 打开 Pull Request

### 开发指南
- 编写全面的 TypeScript 类型
- 为所有公共函数添加英文 JSDoc 注释
- 遵循现有代码风格和模式
- 彻底测试你的更改
- 根据需要更新文档

## 📄 许可证

本项目在 MIT 许可证下发布 - 查看 [LICENSE](LICENSE) 文件了解详情。