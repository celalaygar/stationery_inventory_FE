'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { Category, CategoryTypes } from '@/lib/slices/categoriesSlice'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { AlertCircle } from 'lucide-react'

interface CategoryDialogProps {
  open: boolean
  category?: Category
  onOpenChange: (open: boolean) => void
  onSubmit: (category: Category) => void
}

export default function CategoryDialog({ open, category, onOpenChange, onSubmit }: CategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: CategoryTypes.BOOKS as string | CategoryTypes.STATIONERY as string,
    description: '',
    active: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        description: category.description,
        active: category.active,
      })
      setErrors({})
    } else {
      setFormData({
        name: '',
        type: CategoryTypes.BOOKS,
        description: '',
        active: true,
      })
      setErrors({})
    }
  }, [category, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

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
        id: category ? category.id : undefined,
      } as Category)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</DialogTitle>
          <DialogDescription>
            {category ? 'Kategori bilgilerini güncelleyin' : 'Yeni bir kategori oluşturmak için bilgileri girin'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm">
              Kategori Adı *
            </Label>
            <Input
              id="name"
              placeholder="Örneğin: Eğitim"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: '' })
              }}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Category Type */}
          <div className="space-y-1">
            <Label htmlFor="type" className="text-sm">
              Kategori Türü *
            </Label>
            <Select value={formData.type} onValueChange={(value) => {
              setFormData({ ...formData, type: value as 'book' | 'stationery' })
              if (errors.type) setErrors({ ...errors, type: '' })
            }}>
              <SelectTrigger id="type" className={errors.type ? 'border-destructive' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CategoryTypes.BOOKS}>Kitap</SelectItem>
                <SelectItem value={CategoryTypes.STATIONERY}>Kırtasiye</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.type}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description" className="text-sm">
              Açıklama
            </Label>
            <textarea
              id="description"
              placeholder="Kategori hakkında kısa bir açıklama"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
            <div className="space-y-0.5">
              <Label htmlFor="active" className="text-sm font-medium cursor-pointer">
                Kategori Durumu
              </Label>
              <p className="text-xs text-muted-foreground">
                {formData.active ? 'Aktif - Kullanılabilir' : 'Pasif - Gizli'}
              </p>
            </div>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">{category ? 'Güncelle' : 'Ekle'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
