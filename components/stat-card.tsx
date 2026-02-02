import { type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change: string
  changePositive: boolean
}

export default function StatCard({ title, value, icon: Icon, change, changePositive }: StatCardProps) {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          <p className={`text-xs mt-2 ${changePositive ? 'text-green-600' : 'text-red-600'}`}>{change}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  )
}
