'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { updateBook, BookSaveRequest, PagedResponse, BookPageRequest } from '@/lib/slices/booksSlice'
import BooksTable from '@/components/books-table'
import BookDialog from '@/components/book-dialog'
import { Button } from '@/components/ui/button'
import { Plus, Download, Search } from 'lucide-react'
import { Book } from '@/lib/slices/booksSlice'
import { Category, CategoryTypes } from '@/lib/slices/categoriesSlice'
import { getCategoriesByTypeHelper } from '@/lib/service/helper/category-helper'
import { deleteBookHelper, getBooksByPaginationHelper, saveBookHelper, updateBookHelper } from '@/lib/service/helper/books-helper'


export default function BooksPage() {
  //const books = useAppSelector((state) => state.books.items)
  const dispatch = useAppDispatch()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  const [bookCategories, setBookCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState<Book[] | null>(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize, setPageSize] = useState(50)
  const [searchText, setSearchText] = useState("")
  const [bookPageResponse, setBookPageResponse] = useState<PagedResponse<Book> | null>(null);

  const getCategories = useCallback(async () => {
    setBookCategories([]) // Clear previous categories
    const response: Category[] | null = await getCategoriesByTypeHelper(CategoryTypes.BOOKS, { setLoading: setLoading });
    if (response !== null) {
      setBookCategories(response);
    } else {
      setBookCategories([]);
    }
  }, []);


  const getBooks = useCallback(async (page: number = 0, search: string = "") => {
    setLoading(true)
    try {
      const requestBody: BookPageRequest = {
        page: page,
        size: pageSize,
        searchText: search
      };


      const response: PagedResponse<Book> | null = await getBooksByPaginationHelper(requestBody, { setLoading: setLoading });

      if (response && response.content) {
        setBooks(response.content);
        setTotalPages(response.totalPages);
        setCurrentPage(response.number);
        setBookPageResponse(response);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error(error);
      setBooks([]);
    } finally {
      setLoading(false)
    }
  }, [pageSize]);

  useEffect(() => {
    getCategories();
    getBooks(0, "");
  }, [getCategories, getBooks])


  const handleAddBook = async (book: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook: BookSaveRequest = {
      ...book,
      id: null,
    }
    const response: Book | null = await saveBookHelper(newBook, { setLoading: setLoading });
    if (response !== null) {
      getBooks(currentPage, searchText);
    }

    setDialogOpen(false)
  }

  const handleUpdateBook = async (book: BookSaveRequest) => {
    const newBook: BookSaveRequest = {
      ...book,
    }
    if (!book.id) return;
    const response: Book | null = await updateBookHelper(book.id, newBook, { setLoading: setLoading });
    if (response !== null) {
      getBooks(currentPage, searchText);
    }

    setEditingBook(null)
    setDialogOpen(false)
  }

  const handleDeleteBook = async (id: string) => {
    if (confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
      const response: boolean | null = await deleteBookHelper(id, { setLoading });
      if (response !== null && response === true) {
        getBooks(currentPage, searchText);
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


  const handleSearch = () => {
    getBooks(0, searchText);
  }

  // Sayfa değiştirme
  const handlePageChange = (newPage: number) => {
    getBooks(newPage, searchText);
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kitap Yönetimi</h1>
          <p className="text-muted-foreground mt-2 ">Toplam
            <b className="font-bold"> {bookPageResponse?.totalElements || 0}</b> kitap envanterde</p>
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

      <div className="flex items-center justify-between gap-2">

        {/* Search Bar */}
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Kitap adı veya barkod ile ara"
          className="flex-1 p-2 border border-border rounded-lg bg-white text-foreground "
        />
        <Button size="lg" className="gap-2" onClick={handleSearch}>
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
        ) :
          <>
            <BooksTable books={books} onEdit={handleEdit} onDelete={handleDeleteBook} />

            {/* Pagination UI */}
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Toplam <strong>{totalPages}</strong> sayfadan <strong>{currentPage + 1}</strong>. sayfa gösteriliyor
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Önceki
                </Button>
                <div className="flex items-center gap-1">
                  {/* Basit sayfa numaraları */}
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => handlePageChange(i)}
                    >
                      {i + 1}
                    </Button>
                  )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 3))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          </>
      }

    </div>
  )
}
