'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { Book, BookSaveRequest } from '@/lib/slices/booksSlice'
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
import { AlertCircle } from 'lucide-react'
import { Category } from "@/lib/slices/categoriesSlice"

interface BookDialogProps {
  bookCategories: Category[]
  open: boolean
  book?: Book
  onOpenChange: (open: boolean) => void
  onSubmit: (book: BookSaveRequest) => void
}

export default function BookDialog({ bookCategories, open, book, onOpenChange, onSubmit }: BookDialogProps) {
  const [formData, setFormData] = useState<BookSaveRequest>({
    id: undefined,
    name: '',
    barcode: '',
    price: 0,
    shelfNo: '',
    stockCount: 0,
    categoryId: '',
    createdAt: undefined,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (book) {
      setFormData({
        id: book.id,
        name: book.name,
        barcode: book.barcode,
        price: book.price,
        shelfNo: book.shelfNo,
        stockCount: book.stockCount,
        categoryId: book.category.id,
        createdAt: book.createdAt,
      })
      setErrors({})
    } else {
      setFormData({
        id: undefined,
        name: '',
        barcode: '',
        price: 0,
        shelfNo: '',
        stockCount: 0,
        categoryId: '',
        createdAt: undefined,
      })
      setErrors({})
    }
  }, [book, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Kitap adı boş bırakılamaz'
    }
    if (!formData.barcode.trim()) {
      newErrors.barcode = 'Barkod boş bırakılamaz'
    }
    if (!formData.shelfNo.trim()) {
      newErrors.shelfNo = 'Raf numarası boş bırakılamaz'
    }
    if (formData.price <= 0) {
      newErrors.price = 'Fiyat sıfırdan büyük olmalıdır'
    }
    if (formData.stockCount < 0) {
      newErrors.stockCount = 'Miktar negatif olamaz'
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategori seçilmelidir'
    }

    console.log(newErrors);
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(validateForm());
    if (validateForm()) {
      onSubmit({
        ...formData,
        name: formData.name.trim(),
        barcode: formData.barcode.trim(),
        shelfNo: formData.shelfNo.trim(),
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{book ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}</DialogTitle>
          <DialogDescription>
            {book ? 'Kitap bilgilerini güncelleyin' : 'Yeni bir kitap eklemek için bilgileri girin'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm">
              Kitap Adı *
            </Label>
            <Input
              id="name"
              placeholder="Örneğin: Türk Dili ve Edebiyatı"
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

          {/* Barcode */}
          <div className="space-y-1">
            <Label htmlFor="barcode" className="text-sm">
              Barkod *
            </Label>
            <Input
              id="barcode"
              placeholder="Örneğin: 5901234123457"
              value={formData.barcode}
              onChange={(e) => {
                setFormData({ ...formData, barcode: e.target.value })
                if (errors.barcode) setErrors({ ...errors, barcode: '' })
              }}
              className={errors.barcode ? 'border-destructive' : ''}
            />
            {errors.barcode && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.barcode}
              </p>
            )}
          </div>


          {/* Category */}
          <div className="space-y-1">
            <Label htmlFor="category" className="text-sm">
              Kategori *
            </Label>
            <Select value={formData.categoryId} onValueChange={(value) => {
              setFormData({ ...formData, categoryId: value })
              if (errors.categoryId) setErrors({ ...errors, categoryId: '' })
            }}>
              <SelectTrigger id="categoryId" className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {bookCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Shelf Number */}
          <div className="space-y-1">
            <Label htmlFor="shelfNo" className="text-sm">
              Raf No *
            </Label>
            <Input
              id="shelfNo"
              placeholder="Örneğin: A-01"
              value={formData.shelfNo}
              onChange={(e) => {
                setFormData({ ...formData, shelfNo: e.target.value })
                if (errors.shelfNo) setErrors({ ...errors, shelfNo: '' })
              }}
              className={errors.shelfNo ? 'border-destructive' : ''}
            />
            {errors.shelfNo && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.shelfNo}
              </p>
            )}
          </div>

          {/* Price and stockCount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="price" className="text-sm">
                Fiyat (₺) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  if (errors.price) setErrors({ ...errors, price: '' })
                }}
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" />
                  {errors.price}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="stockCount" className="text-sm">
                Adet *
              </Label>
              <Input
                id="stockCount"
                type="number"
                placeholder="0"
                value={formData.stockCount}
                onChange={(e) => {
                  setFormData({ ...formData, stockCount: parseInt(e.target.value) || 0 })
                  if (errors.stockCount) setErrors({ ...errors, stockCount: '' })
                }}
                className={errors.stockCount ? 'border-destructive' : ''}
              />
              {errors.stockCount && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" />
                  {errors.stockCount}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">{book ? 'Güncelle' : 'Ekle'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
