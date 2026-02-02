import { configureStore } from '@reduxjs/toolkit'
import booksReducer from '@/lib/slices/booksSlice'
import stationeryReducer from '@/lib/slices/stationerySlice'
import categoriesReducer from '@/lib/slices/categoriesSlice'

export const store = configureStore({
  reducer: {
    books: booksReducer,
    stationery: stationeryReducer,
    categories: categoriesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
