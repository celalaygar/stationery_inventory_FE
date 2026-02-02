'use client'

import { Book } from '@/lib/slices/booksSlice'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'

interface BooksTableProps {
  books: Book[]
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
}

export default function BooksTable({ books, onEdit, onDelete }: BooksTableProps) {
  return (
    <Card className="overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left font-semibold text-foreground">Kitap Adı</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Barkod</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Türü</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Kategori</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Raf No</th>
              <th className="px-6 py-3 text-right font-semibold text-foreground">Adet</th>
              <th className="px-6 py-3 text-right font-semibold text-foreground">Fiyat</th>
              <th className="px-6 py-3 text-center font-semibold text-foreground">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {books?.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                  Henüz kitap eklenmemiş
                </td>
              </tr>
            ) : (
              books?.map((book) => (
                <tr key={book.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{book.name}</td>
                  <td className="px-6 py-4 text-sm text-foreground font-mono">{book.barcode}</td>
                  <td className="px-6 py-4 text-foreground">{book.genre}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{book.category.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-foreground">{book.shelfNo}</td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">{book.stockCount}</td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">₺{book.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(book)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onDelete(book.id)}>
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
