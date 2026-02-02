'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { addStationery, updateStationery, deleteStationery } from '@/lib/slices/stationerySlice'
import StationeryTable from '@/components/stationery-table'
import StationeryForm from '@/components/stationery-form'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Download } from 'lucide-react'
import { Stationery } from '@/lib/slices/stationerySlice'

export default function StationeryPage() {
  const items = useAppSelector((state) => state.stationery.items)
  const categories = useAppSelector((state) => state.categories.items.filter((c) => c.type === 'stationery'))
  const dispatch = useAppDispatch()
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Stationery | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const lowStockItems = items.filter((item) => item.stock < 10); // Declaring lowStockItems

  const handleAddStationery = (item: Omit<Stationery, 'id' | 'createdAt'>) => {
    const newItem: Stationery = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    dispatch(addStationery(newItem))
    setShowForm(false)
  }

  const handleUpdateStationery = (item: Omit<Stationery, 'createdAt'>) => {
    dispatch(
      updateStationery({
        ...item,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
      })
    )
    setEditingItem(null)
    setShowForm(false)
  }

  const handleDeleteStationery = (id: string) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      dispatch(deleteStationery(id))
    }
  }

  const handleEdit = (item: Stationery) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter((item) => item.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kırtasiye Yönetimi</h1>
          <p className="text-muted-foreground mt-2">Toplam {items.length} ürün envanterde</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Dışa Aktar
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            Yeni Ürün Ekle
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
        <label className="text-sm font-medium text-foreground">Kategoriye Göre Filtrele:</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCategory !== 'all' && (
          <span className="text-xs text-muted-foreground ml-auto">
            {filteredItems.length} ürün gösteriliyor
          </span>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <StationeryForm item={editingItem || undefined} onSubmit={editingItem ? handleUpdateStationery : handleAddStationery} onCancel={handleCloseForm} />
      )}

      {/* Table */}
      <StationeryTable items={filteredItems} onEdit={handleEdit} onDelete={handleDeleteStationery} />
    </div>
  )
}
