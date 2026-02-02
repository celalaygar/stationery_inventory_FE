'use client'

import React from "react"

import { useState } from 'react'
import { Category } from '@/lib/slices/categoriesSlice'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AlertCircle } from 'lucide-react'

interface CategoryFormProps {
  category?: Category
  onSubmit: (category: Omit<Category, 'id' | 'createdAt' | 'itemCount'>) => void
  onCancel: () => void
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    type: category?.type || ('book' as 'book' | 'stationery'),
    description: category?.description || '',
    active: category?.active ?? true,
  })
  const [errors, setErrors] = useState<{ name?: string; type?: string }>({})

  const validateForm = () => {
    const newErrors: { name?: string; type?: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Kategori adı boş bırakılamaz'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Kategori adı en az 2 karakter olmalıdır'
    }

    if (!formData.type) {
      newErrors.type = 'Kategori türü seçilmelidir'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        ...formData,
        name: formData.name.trim(),
      })
    }
  }

  return (
    <Card className="p-6 bg-card border border-border">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{category ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h3>
          <p className="text-sm text-muted-foreground mt-1">Kategori bilgilerini girin ve durumunu ayarlayın</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-1">
            Kategori Adı
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Örneğin: Eğitim"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              if (errors.name) {
                setErrors({ ...errors, name: undefined })
              }
            }}
            className={errors.name ? 'border-destructive focus:ring-destructive' : ''}
          />
          {errors.name && (
            <div className="flex items-center gap-2 mt-1 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="flex items-center gap-1">
            Kategori Türü
            <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.type} onValueChange={(value) => {
            setFormData({ ...formData, type: value as 'book' | 'stationery' })
            if (errors.type) {
              setErrors({ ...errors, type: undefined })
            }
          }}>
            <SelectTrigger id="type" className={errors.type ? 'border-destructive focus:ring-destructive' : ''}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="book">Kitap</SelectItem>
              <SelectItem value="stationery">Kırtasiye</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <div className="flex items-center gap-2 mt-1 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.type}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Açıklama</Label>
          <textarea
            id="description"
            placeholder="Kategori hakkında kısa bir açıklama (opsiyonel)"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
          <div>
            <Label htmlFor="active" className="text-sm font-medium text-foreground">
              Kategori Durumu
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.active ? 'Bu kategori aktif ve kullanılabilir' : 'Bu kategori pasif ve görünmez'}
            </p>
          </div>
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
          />
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            İptal
          </Button>
          <Button type="submit">{category ? 'Güncelle' : 'Ekle'}</Button>
        </div>
      </form>
    </Card>
  )
}
