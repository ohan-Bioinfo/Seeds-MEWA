/* Design Philosophy: Data-Driven Cartography with Agricultural Heritage
   Stats Cards: Hexagonal honeycomb-inspired cards with agricultural color coding
   Wheat = golden, Coffee = brown, Total = olive green
*/

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wheat, Coffee, Database } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  type: 'wheat' | 'coffee' | 'total';
  subtitle?: string;
}

export default function StatsCard({ title, value, type, subtitle }: StatsCardProps) {
  const colors = {
    wheat: {
      bg: 'bg-[#D4A574]/10',
      border: 'border-[#D4A574]',
      text: 'text-[#B88A5E]',
      icon: Wheat
    },
    coffee: {
      bg: 'bg-[#6B4423]/10',
      border: 'border-[#6B4423]',
      text: 'text-[#6B4423]',
      icon: Coffee
    },
    total: {
      bg: 'bg-[#4A5D3F]/10',
      border: 'border-[#4A5D3F]',
      text: 'text-[#4A5D3F]',
      icon: Database
    }
  };
  
  const config = colors[type];
  const Icon = config.icon;
  
  return (
    <Card className={`${config.bg} ${config.border} border-l-4 hover:shadow-md transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${config.text}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-display font-bold ${config.text}`}>
          {value.toLocaleString()}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
