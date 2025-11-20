# Teable Ranking Plugin

A [Teable](https://teable.ai) plugin for automatic ranking of table records.

## 📺 Demo

![Demo GIF](./image/20251120012132_rec_.gif)

## ✨ Features

- 🏆 **Multiple Ranking Methods** - Standard and Dense ranking algorithms
- 🎯 **Field Mapping** - Flexible source and target field selection
- 📊 **Group-based Ranking** - Calculate rankings within specific groups
- 🔧 **Advanced Configuration** - Sort direction, zero value handling, and more
- 🎨 **Theme Support** - Full light/dark mode compatibility with automatic theme detection
- 🌍 **Internationalization** - Complete i18n support (English/Chinese)
- 📱 **Responsive Design** - Optimized for all screen sizes
- ⚡ **Performance Optimized** - Built with React Query for efficient data fetching
- 🛡️ **Error Handling** - Comprehensive error reporting and user feedback
- 🔌 **Teable Integration** - Seamless integration with Teable tables and fields

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14.2.14** - React full-stack framework with App Router
- **React 18.2.0** - UI library with modern React features
- **TypeScript 5** - Type-safe JavaScript superset (strict mode enabled)

### Teable Ecosystem
- `@teable/sdk` - Plugin bridge and UI configuration
- `@teable/openapi` - API client and type definitions
- `@teable/core` - Core type definitions and utilities
- `@teable/ui-lib` - Teable official UI component library (shadcn/ui based)
- `@teable/next-themes` - Theme switching support

### UI & Styling
- **Tailwind CSS 3.4.1** - Atomic CSS framework with Teable UI configuration
- **Lucide React** - Icon library for modern interfaces

### State Management & Data
- `@tanstack/react-query 4.36.1` - Server state management, caching, and synchronization
- `react-i18next 14.1.0` - Internationalization framework
- `i18next 23.10.1` - Core internationalization library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Teable account with plugin access

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev -p 3001
```
Visit [http://localhost:3001](http://localhost:3001) to view the plugin.

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm start
```

### 5. Code Quality Checks
```bash
npm run lint          # Run ESLint
```

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Main app entry with i18n and theme setup
│   ├── Main.tsx                 # Theme and QueryClient integration
│   ├── layout.tsx               # Root layout component
│   └── globals.css              # Global styles and CSS variables
├── components/
│   ├── RankingPages.tsx         # Main ranking interface component
│   ├── ErrorBoundary.tsx        # Error boundary component
│   ├── context/                 # React Context providers
│   │   ├── EnvProvider.tsx      # Environment variable injection
│   │   ├── I18nProvider.tsx     # Internationalization provider
│   │   └── types.ts             # TypeScript type definitions
│   ├── ranking/                 # Ranking-specific components
│   │   ├── ColumnSelector.tsx   # Field selection component
│   │   ├── GroupFieldSelector.tsx # Group field selection
│   │   ├── RankingConfig.tsx    # Ranking configuration UI
│   │   ├── RankingExecutor.tsx  # Ranking execution engine
│   │   └── types.ts             # Ranking type definitions
│   └── ui/                      # UI utility components
├── hooks/                       # Custom React hooks
│   ├── useInitApi.ts           # API initialization
│   ├── useFields.ts            # Field data fetching
│   ├── useFieldMap.ts          # Field mapping utilities
│   ├── useGlobalUrlParams.ts   # URL parameter management
│   ├── useToast.ts             # Toast notifications
│   └── useAsyncError.ts        # Async error handling
├── lib/                         # Business logic and utilities
│   ├── RankingAlgorithms.ts    # Ranking calculation algorithms
│   └── rankRecord.ts           # Record ranking operations
├── types/                       # Global type definitions
│   ├── field.ts                # Field-related types
│   └── index.ts                # Type exports
├── locales/                     # Internationalization files
│   ├── en.json                 # English translations
│   └── zh.json                 # Chinese translations
└── scripts/                     # Build and optimization scripts
```

## 🔧 Configuration

### Plugin Parameters
The plugin reads configuration from URL parameters via `EnvProvider.tsx`:

- `baseId` - Teable base identifier
- `pluginId` - Plugin identifier
- `pluginInstallId` - Plugin installation ID
- `tableId` - Target table for ranking operations
- `shareId`, `positionId`, `positionType` - UI positioning
- `lang`, `theme` - Localization and theme settings

### Ranking Configuration

The plugin supports the following ranking configurations:

#### Ranking Methods
- **Standard Ranking**: `1, 2, 2, 4` - Standard competition ranking
- **Dense Ranking**: `1, 2, 2, 3` - Dense ranking with no gaps
- **European Ranking**: `1, 2, 2, 3` - European competition ranking

#### Zero Value Handling
- **Skip Zero Values**: Ignore zero values in ranking calculations
- **Include Zero Values**: Include zero values in ranking

#### Grouping
- **No Grouping**: Calculate rankings across all records
- **Group-based**: Calculate rankings within specified groups

## 🎨 Styling & Theming

### CSS Architecture
- **CSS Variables** - Comprehensive theme system with HSL color values
- **Responsive Design** - Mobile-first approach with breakpoints
- **Component Isolation** - Scoped styles for custom components
- **Dark Mode Support** - Automatic theme detection and switching

### UI Components
- **Shadcn/ui Components** - Modern, accessible UI components
- **Teable UI Integration** - Consistent with Teable design system
- **Form Controls** - Custom form elements for ranking configuration

## 🌍 Internationalization

Supported languages:
- English (en)
- Chinese (zh)

### Adding New Languages
1. Create translation file in `src/locales/[lang].json`
2. Update `I18nProvider.tsx` resources configuration
3. Add language-specific content to components

## 🔌 Teable Integration

### Plugin Bridge Usage
```typescript
import { usePluginBridge } from '@teable/sdk';

const bridge = usePluginBridge();

// Listen for configuration changes
bridge.on('syncUIConfig', handleConfigChange);

// Get temporary token for API calls
const token = await bridge.getSelfTempToken();
```

### API Integration
The plugin uses Teable's OpenAPI with automatic authentication:
```typescript
import { openApi } from '@teable/openapi';

// All API calls are automatically authenticated
const fields = await openApi.getFields(tableId);
const records = await openApi.getTableRecords(tableId, viewId);
```

## 🏆 Ranking Algorithms

The plugin implements two ranking algorithms:

### Standard Ranking
```typescript
// Example: Values [10, 20, 20, 30] → Ranks [1, 2, 2, 4]
// Standard competition ranking with gaps
```

### Dense Ranking
```typescript
// Example: Values [10, 20, 20, 30] → Ranks [1, 2, 2, 3]
// Dense ranking without gaps
```

## 🚀 Deployment

### Build Process
```bash
# Build for production
npm run build
```

### Plugin Installation
1. Build the plugin: `npm run build`
2. Deploy to your hosting service
3. Configure in Teable with proper URL parameters
4. Test plugin functionality in Teable environment

## 🧪 Development

### Code Quality
- **TypeScript Strict Mode** - Full type safety enabled
- **ESLint** - Code quality and style enforcement
- **Prettier** - Consistent code formatting

### Performance Features
- **React Query** - Efficient data fetching and caching
- **React.memo** - Component optimization
- **useMemo/useCallback** - Hook optimization
- **Code Splitting** - Optimized bundle loading

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Write comprehensive TypeScript types
- Add English JSDoc comments for all public functions
- Follow the existing code style and patterns
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.