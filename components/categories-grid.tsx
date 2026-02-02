'use client'

import { Category } from '@/lib/slices/categoriesSlice'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Edit2, Trash2, Layers, CheckCircle, Circle } from 'lucide-react'

interface CategoriesGridProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, active: boolean) => void
}

export default function CategoriesGrid({ categories, onEdit, onDelete, onToggleStatus }: CategoriesGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Bu türde kategori bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          className={`p-6 transition-all border ${category.active
            ? 'bg-card border-border hover:border-primary/50 hover:shadow-md'
            : 'bg-muted/30 border-border/50 opacity-75'
            }`}
        >
          <div className="space-y-4">
            {/* Header with status */}
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                  {category.active ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{category.description || 'Açıklama yok'}</p>
              </div>
              <div className={`p-2 rounded-lg ${category.active ? 'bg-primary/10' : 'bg-muted'}`}>
                <Layers className={`w-5 h-5 ${category.active ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
            </div>

            {/* Item count */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{category.itemCount}</span>
                  <span className="ml-1">
                    {category.itemCount === 1 ? 'ürün' : 'ürün'}
                  </span>
                </p>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${category.active
                  ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                  {category.active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>

            {/* Status toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50">
              <span className="text-xs font-medium text-foreground">
                {category.active ? 'Aktif' : 'Pasif'}
              </span>
              <Switch
                checked={category.active}
                onCheckedChange={() => onToggleStatus(category.id, category.active)}
                aria-label={`Toggle ${category.name} status`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => onEdit(category)}
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Düzenle
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-destructive hover:text-destructive bg-transparent"
                onClick={() => {
                  if (confirm(`"${category.name}" kategorisini silmek istediğinize emin misiniz?`)) {
                    onDelete(category.id)
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Sil
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
