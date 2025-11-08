# Teable Markdown 渲染器插件

一个基于 [Teable](https://teable.ai) 的插件，可渲染表格单元格 Markdown 内容

## ✨ 功能特性

- 📝 **Markdown 渲染** - 从选中的表格单元格渲染 Markdown 内容
- 🎨 **增强样式** - 自定义样式，支持 GitHub 风格的 Markdown
- 🌈 **主题支持** - 完整的明暗模式兼容，自动主题检测
- 🌍 **国际化** - 完整的 i18n 支持（英文/中文）
- 📋 **GitHub 风格 Markdown** - 支持表格、代码块和扩展语法
- 🎯 **代码高亮** - 语法高亮
- 📱 **响应式设计** - 针对所有屏幕尺寸优化
- 🎭 **自定义组件** - 增强的提示框、表格和引用块
- ⚡ **性能优化** - 使用 React Query 实现高效数据获取

## 🛠️ 技术栈

### 核心框架
- **Next.js 14.2.14** - 带 App Router 的 React 全栈框架
- **React 18.2.0** - 现代化 React 功能的 UI 库
- **TypeScript 5** - 类型安全的 JavaScript 超集

### Teable 生态
- `@teable/sdk` - 插件桥接和 UI 配置
- `@teable/openapi` - API 客户端和类型定义
- `@teable/core` - 核心类型定义和工具
- `@teable/ui-lib` - Teable 官方 UI 组件库
- `@teable/next-themes` - 主题切换支持

### Markdown 和样式
- `react-markdown` - 带 React 组件的 Markdown 渲染
- `remark-gfm` - GitHub 风格 Markdown 支持
- `shiki` - 语法高亮引擎
- `github-markdown-css` - GitHub 风格 Markdown CSS
- `tailwindcss` - 原子化 CSS 框架
- `@tailwindcss/typography` - 排版工具

### 状态管理和数据
- `@tanstack/react-query` - 服务端状态管理和缓存
- `react-i18next` - 国际化框架
- `i18next` - 核心国际化库

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn
- 具有 API 访问权限的 Teable 账户

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev -p 3000
```
访问 [http://localhost:3000](http://localhost:3000) 查看插件。

### 3. 构建生产版本
```bash
npm run build
```

### 4. 启动生产服务器
```bash
npm start
```

### 5. 优化资源（可选）
```bash
npm run optimize
npm run build:optimized
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
│   ├── MarkdownRenderer.tsx     # 主要的 Markdown 渲染组件
│   ├── MarkdownPages.tsx        # 页面包装组件
│   ├── context/                 # React Context 提供者
│   │   ├── EnvProvider.tsx      # 环境变量注入
│   │   ├── I18nProvider.tsx     # 国际化提供者
│   │   └── types.ts             # TypeScript 类型定义
│   ├── markdown/                # 自定义 Markdown 组件
│   │   ├── CustomComponents.tsx # 增强的 Markdown 组件映射
│   │   ├── CodeBlock.tsx        # 语法高亮代码块
│   │   ├── Callout.tsx          # 自定义提示框组件
│   │   └── TableOfContents.tsx  # 目录生成
│   └── ui/                      # UI 工具组件
│       └── Icons.tsx            # 自定义图标组件
├── hooks/                       # 自定义 React Hooks
│   ├── useInitApi.ts           # API 初始化
│   └── useViewId.ts            # 视图 ID 管理
├── styles/                      # 样式
│   ├── markdown.css            # Markdown 特定样式
│   └── custom-enhancements.css  # 自定义组件样式
├── locales/                     # 国际化文件
│   ├── en.json                 # 英文翻译
│   └── zh.json                 # 中文翻译
└── scripts/                     # 构建和优化脚本
    └── optimize-assets.js      # 资源优化
```

## 🔧 配置

### 插件参数
插件通过 `EnvProvider.tsx` 从 URL 参数读取配置：

- `baseId` - Teable 基础标识符
- `pluginId` - 插件标识符
- `pluginInstallId` - 插件安装 ID
- `tableId` - Markdown 内容的目标表格
- `shareId`, `positionId`, `positionType` - UI 定位
- `lang`, `theme` - 本地化和主题设置

### 环境设置
插件自动：
- 从 URL 参数读取 Teable 配置
- 设置主题检测和切换
- 初始化带正确语言检测的国际化
- 配置带身份验证的 API 客户端

## 🎨 样式和主题

### CSS 架构
- **CSS 变量** - 使用 HSL 颜色值的完整主题系统
- **响应式设计** - 移动优先的方法，带断点
- **组件隔离** - 自定义组件的作用域样式
- **暗色模式支持** - 自动主题检测和切换

### 自定义组件
- **提示框** - 带悬停效果的彩色信息框
- **代码块** - 语法高亮，带复制按钮和行号
- **表格** - 增强样式，带悬停状态和响应式设计
- **引用块** - 带装饰元素的自定义样式

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

// 监听选择变化
bridge.on('syncSelection', handleSelection);

// 获取选中单元格内容
const result = await bridge.getSelectionRecords(selection);
```

### API 集成
插件使用 Teable 的 OpenAPI，自动身份验证：
```typescript
import { openApi } from '@teable/openapi';

// 所有 API 调用都自动身份验证
const data = await openApi.getTableRecords(tableId, viewId);
```

## 🚀 部署

### 构建优化
```bash
# 分析包大小
npm run analyze

# 带资源优化的构建
npm run build:optimized
```

### 插件安装
1. 构建插件：`npm run build`
2. 部署到你的托管服务
3. 在 Teable 中配置正确的 URL 参数
4. 在 Teable 环境中测试插件功能

## 🤝 贡献

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 打开 Pull Request

## 📄 许可证

本项目在 MIT 许可证下发布 - 查看 [LICENSE](LICENSE) 文件了解详情。
