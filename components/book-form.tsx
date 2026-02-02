'use client'

import React from "react"

import { useState } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { Book } from '@/lib/slices/booksSlice'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface BookFormProps {
  book?: Book
  onSubmit: (book: Omit<Book, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export default function BookForm({ book, onSubmit, onCancel }: BookFormProps) {
  const categories = useAppSelector((state) => state.categories.items.filter((c) => c.type === 'book'))

  const [formData, setFormData] = useState({
    title: book?.title || '',
    barcode: book?.barcode || '',
    genre: book?.genre || '',
    price: book?.price || 0,
    shelfNo: book?.shelfNo || '',
    stockCount: book?.stockCount || 0,
    category: book?.category || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="p-6 bg-card border border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">{book ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Kitap Adı *</Label>
            <Input
              id="title"
              placeholder="Örneğin: Türk Dili ve Edebiyatı"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barcode">Barkod *</Label>
            <Input
              id="barcode"
              placeholder="Örneğin: 5901234123457"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Kitap Türü *</Label>
            <Input
              id="genre"
              placeholder="Örneğin: Eğitim, Roman, Bilim Kurgu"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              required
            />
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
            <Label htmlFor="shelfNo">Raf No *</Label>
            <Input
              id="shelfNo"
              placeholder="Örneğin: A-01, B-02"
              value={formData.shelfNo}
              onChange={(e) => setFormData({ ...formData, shelfNo: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockCount">Adet/Stok *</Label>
            <Input
              id="stockCount"
              type="number"
              placeholder="0"
              value={formData.stockCount}
              onChange={(e) => setFormData({ ...formData, stockCount: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
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
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            İptal
          </Button>
          <Button type="submit">{book ? 'Güncelle' : 'Ekle'}</Button>
        </div>
      </form>
    </Card>
  )
}
