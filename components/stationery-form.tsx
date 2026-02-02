'use client'

import React from "react"
import { useState } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { Stationery } from '@/lib/slices/stationerySlice'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const UNITS = ['Adet', 'Kilogram', 'Litre']; // Declare UNITS variable

interface StationeryFormProps {
  item?: Stationery
  onSubmit: (item: Omit<Stationery, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export default function StationeryForm({ item, onSubmit, onCancel }: StationeryFormProps) {
  const categories = useAppSelector((state) => state.categories.items.filter((c) => c.type === 'stationery'))

  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    price: item?.price || 0,
    quantity: item?.quantity || 0,
    sku: item?.sku || '',
    supplier: item?.supplier || '',
    unit: item?.unit || '',
    reorderLevel: item?.reorderLevel || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="p-6 bg-card border border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">{item ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Ürün Adı *</Label>
            <Input
              id="name"
              placeholder="Örneğin: Tükenmez Kalem (Mavi)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Fiyat (₺) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Adet/Stok *</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            İptal
          </Button>
          <Button type="submit">{item ? 'Güncelle' : 'Ekle'}</Button>
        </div>
      </form>
    </Card>
  )
}
