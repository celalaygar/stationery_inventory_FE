'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { addBook, updateBook, deleteBook, BookSaveRequest } from '@/lib/slices/booksSlice'
import BooksTable from '@/components/books-table'
import BookDialog from '@/components/book-dialog'
import { Button } from '@/components/ui/button'
import { Plus, Download, Search } from 'lucide-react'
import { Book } from '@/lib/slices/booksSlice'
import BookForm from '@/components/book-form' // Import BookForm component
import { Category, CategoryTypes } from '@/lib/slices/categoriesSlice'
import { getCategoriesByTypeHelper } from '@/lib/service/helper/category-helper'
import { deleteBookHelper, getBooksHelper, saveBookHelper } from '@/lib/service/helper/books-helper'

export default function BooksPage() {
  //const books = useAppSelector((state) => state.books.items)
  const dispatch = useAppDispatch()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [showForm, setShowForm] = useState(false) // Declare showForm variable



  const [bookCategories, setBookCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [book, setBook] = useState<Book | null>(null)
  const [books, setBooks] = useState<Book[] | null>(null)


  const getCategories = useCallback(async () => {
    setBookCategories([]) // Clear previous categories
    const response: Category[] | null = await getCategoriesByTypeHelper(CategoryTypes.BOOKS, { setLoading: setLoading });
    if (response !== null) {
      setBookCategories(response);
    } else {
      setBookCategories([]);
    }
  }, []);


  const getBooks = useCallback(async () => {
    setBooks(null)
    const response: Book[] | null = await getBooksHelper({ setLoading: setLoading });
    if (response !== null) {
      console.log(response);
      setBooks(response.slice(-20));

    } else {
      setBooks([]);
    }
  }, []);
  useEffect(() => {
    getCategories();
    getBooks();
  }, [getCategories, getBooks])


  const handleAddBook = async (book: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook: BookSaveRequest = {
      ...book,
      id: null,
    }
    const response: Book | null = await saveBookHelper(newBook, { setLoading: setLoading });
    if (response !== null) {
      setBooks((list) => (list ? [...list, response] : [response]));
    }

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

  const handleDeleteBook = async (id: string) => {
    if (confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
      const response: boolean | null = await deleteBookHelper(id, { setLoading });
      if (response !== null && response === true) {
        getBooks();
      }
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
          <p className="text-muted-foreground mt-2">Toplam {books?.length || 0} kitap envanterde</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Dışa Aktar
          </Button> */}
          <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Yeni Kitap Ekle
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <BookDialog
        bookCategories={bookCategories}
        open={dialogOpen}
        book={editingBook || undefined}
        onOpenChange={handleDialogOpenChange}
        onSubmit={editingBook ? handleUpdateBook : handleAddBook}
      />

      <div className="flex items-center justify-between">

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Kitap adı veya barkod ile ara"
          className="w-full md:w-1/3 p-2 border border-border rounded-lg mt-1 bg-white text-foreground ml-5"
        />

        <Button size="lg" className="gap-2 ">
          <Search className="w-4 h-4" />
          Sorgula
        </Button>
      </div>
      {/* Table */}

      {
        loading ? (
          <div className="flex justify-center items-center py-20">
            <Download className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : <BooksTable books={books} onEdit={handleEdit} onDelete={handleDeleteBook} />
      }

    </div>
  )
}
