'use client'

import { Stationery } from '@/lib/slices/stationerySlice'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, AlertCircle } from 'lucide-react'

interface StationeryTableProps {
  items: Stationery[]
  onEdit: (item: Stationery) => void
  onDelete: (id: string) => void
}

export default function StationeryTable({ items, onEdit, onDelete }: StationeryTableProps) {
  return (
    <Card className="overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left font-semibold text-foreground">Ürün Adı</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Kategori</th>
              <th className="px-6 py-3 text-right font-semibold text-foreground">Fiyat</th>
              <th className="px-6 py-3 text-right font-semibold text-foreground">Adet/Stok</th>
              <th className="px-6 py-3 text-center font-semibold text-foreground">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  Henüz ürün eklenmemiş
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">₺{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">{item.quantity}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
