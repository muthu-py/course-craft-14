import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary/5 border-primary/20';
      case 'success':
        return 'bg-success/5 border-success/20';
      case 'warning':
        return 'bg-warning/5 border-warning/20';
      case 'destructive':
        return 'bg-destructive/5 border-destructive/20';
      default:
        return '';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-primary bg-primary/10';
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'destructive':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  return (
    <Card className={`stats-card ${getVariantStyles()}`}>
      <CardContent className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center space-x-1">
                <span 
                  className={`text-xs font-medium ${
                    trend.isPositive ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${getIconStyles()}`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
};