'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { addBook, updateBook, deleteBook } from '@/lib/slices/booksSlice'
import BooksTable from '@/components/books-table'
import BookDialog from '@/components/book-dialog'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'
import { Book } from '@/lib/slices/booksSlice'
import BookForm from '@/components/book-form' // Import BookForm component

export default function BooksPage() {
  const books = useAppSelector((state) => state.books.items)
  const dispatch = useAppDispatch()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [showForm, setShowForm] = useState(false) // Declare showForm variable

  const handleAddBook = (book: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    dispatch(addBook(newBook))
    setDialogOpen(false)
  }

  const handleUpdateBook = (book: Omit<Book, 'createdAt'>) => {
    dispatch(
      updateBook({
        ...book,
        createdAt: editingBook?.createdAt || new Date().toISOString(),
      })
    )
    setEditingBook(null)
    setDialogOpen(false)
  }

  const handleDeleteBook = (id: string) => {
    if (confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
      dispatch(deleteBook(id))
    }
  }

  const handleEdit = (book: Book) => {
    setEditingBook(book)
    setDialogOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingBook(null)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingBook(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kitap Yönetimi</h1>
          <p className="text-muted-foreground mt-2">Toplam {books.length} kitap envanterde</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Dışa Aktar
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Yeni Kitap Ekle
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <BookDialog
        open={dialogOpen}
        book={editingBook || undefined}
        onOpenChange={handleDialogOpenChange}
        onSubmit={editingBook ? handleUpdateBook : handleAddBook}
      />

      {/* Table */}
      <BooksTable books={books} onEdit={handleEdit} onDelete={handleDeleteBook} />
    </div>
  )
}
