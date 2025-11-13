'use client';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@teable/ui-lib/dist/shadcn/ui/select';
import { Label } from '@teable/ui-lib/dist/shadcn/ui/label';
import { useViews } from '../../hooks/useViews';
import { IView } from '../../types';
import { Sheet, ClipboardList as Form, LayoutGrid as Gallery, Kanban, Calendar } from '@teable/icons';

interface IViewSelectorProps {
  selectedViewId?: string | undefined;
  onViewChange: (viewId: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ViewSelector({
  selectedViewId,
  onViewChange,
  disabled = false,
  className
}: IViewSelectorProps) {
  const { t } = useTranslation('common');
  const { data: views = [], isLoading, error } = useViews();

  // 过滤掉组件和表单视图
  const filteredViews = views.filter((view: IView) =>
    !['component', 'form'].includes(view.type)
  );

  // 视图类型图标映射
  const getViewIcon = (viewType: string) => {
    const iconClassName = "w-4 h-4";

    switch (viewType) {
      case 'grid':
        return <Sheet className={iconClassName} />;
      case 'form':
        return <Form className={iconClassName} />;
      case 'gallery':
        return <Gallery className={iconClassName} />;
      case 'kanban':
        return <Kanban className={iconClassName} />;
      case 'calendar':
        return <Calendar className={iconClassName} />;
      default:
        return <Sheet className={iconClassName} />;
    }
  };

  // 处理视图选择
  const handleViewChange = (viewId: string) => {
    console.log('🎯 [ViewSelector] View selected:', {
      viewId,
      viewName: views.find(v => v.id === viewId)?.name,
      totalViews: views.length
    });
    onViewChange(viewId);
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label htmlFor="view-selector">
          {t('ranking.selectView')}
        </Label>
        <Select disabled>
          <SelectTrigger id="view-selector">
            <SelectValue placeholder={t('ranking.loadingViews')} />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label htmlFor="view-selector">
          {t('ranking.selectView')}
        </Label>
        <Select disabled>
          <SelectTrigger id="view-selector">
            <SelectValue placeholder={t('ranking.loadViewsError')} />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  // 无可用视图
  if (filteredViews.length === 0) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label htmlFor="view-selector">
          {t('ranking.selectView')}
        </Label>
        <Select disabled>
          <SelectTrigger id="view-selector">
            <SelectValue placeholder={t('ranking.noViews')} />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="view-selector">
        {t('ranking.selectView')}
      </Label>
      <Select
        value={selectedViewId || ''}
        onValueChange={handleViewChange}
        disabled={disabled}
      >
        <SelectTrigger id="view-selector">
          <SelectValue
            placeholder={t('ranking.selectViewPlaceholder')}
          />
        </SelectTrigger>
        <SelectContent>
          {filteredViews.map((view: IView) => (
            <SelectItem key={view.id} value={view.id}>
              <div className="flex items-center gap-2">
                {getViewIcon(view.type)}
                <span className="font-medium">{view.name}</span>
                {view.description && (
                  <span className="text-xs text-gray-500 ml-2">• {view.description}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        {t('ranking.viewDescription')}
      </p>
    </div>
  );
}