import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface Item {
  id: string
  name: string
  category: string
  stockCount: number
  price: number
}

interface RecentItemsCardProps {
  title: string
  items: Item[]
  type: 'book' | 'stationery'
}

export default function RecentItemsCard({ title, items, type }: RecentItemsCardProps) {
  const href = type === 'book' ? '/dashboard/books' : '/dashboard/stationery'

  return (
    <Card className="p-6 bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <Link href={href} className="text-sm text-primary hover:underline">
          Tümünü Gör →
        </Link>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz öğe yok</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-semibold text-foreground">{item.stockCount} adet</p>
                <p className="text-xs text-muted-foreground">₺{item.price.toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
