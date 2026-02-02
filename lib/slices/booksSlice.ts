import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Book {
  id: string
  title: string
  name: string
  barcode: string
  genre: string
  price: number
  shelfNo: string
  stockCount: number
  category: string
  createdAt: string
}

interface BooksState {
  items: Book[]
  total: number
}

const initialState: BooksState = {
  items: [
    {
      id: '1',
      title: 'Türk Dili ve Edebiyatı',
      barcode: '5901234123457',
      genre: 'Eğitim',
      price: 89.99,
      shelfNo: 'A-01',
      stockCount: 45,
      category: 'Eğitim',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Matematik Temelleri',
      barcode: '5901234123458',
      genre: 'Bilim',
      price: 75.50,
      shelfNo: 'B-02',
      stockCount: 32,
      category: 'Eğitim',
      createdAt: new Date().toISOString(),
    },
  ],
  total: 77,
}

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      state.items.push(action.payload)
      state.total += action.payload.stockCount
    },
    updateBook: (state, action: PayloadAction<Book>) => {
      const index = state.items.findIndex((book) => book.id === action.payload.id)
      if (index !== -1) {
        const oldstockCount = state.items[index].stockCount
        state.items[index] = action.payload
        state.total = state.total - oldstockCount + action.payload.stockCount
      }
    },
    deleteBook: (state, action: PayloadAction<string>) => {
      const book = state.items.find((b) => b.id === action.payload)
      if (book) {
        state.total -= book.stockCount
        state.items = state.items.filter((b) => b.id !== action.payload)
      }
    },
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.items = action.payload
      state.total = action.payload.reduce((sum, book) => sum + book.stockCount, 0)
    },
  },
})

export const { addBook, updateBook, deleteBook, setBooks } = booksSlice.actions
export default booksSlice.reducer
