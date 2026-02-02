import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum CategoryTypes {
  BOOKS = 'BOOKS',
  STATIONERY = 'STATIONERY',
}


export interface Category {
  id: string
  name: string
  type: CategoryTypes.BOOKS | CategoryTypes.STATIONERY
  description: string
  itemCount: number
  active: boolean
  createdAt: string
}

interface CategoriesState {
  items: Category[]
}

const initialState: CategoriesState = {
  items: [
    {
      id: '1',
      name: 'Eğitim',
      type: 'book',
      description: 'Eğitim alanında kitaplar',
      itemCount: 2,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Roman',
      type: 'book',
      description: 'Roman ve edebiyat eserleri',
      itemCount: 0,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Bilim Kurgu',
      type: 'book',
      description: 'Bilim kurgu romanları ve hikayeler',
      itemCount: 0,
      active: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Yazı Araçları',
      type: 'stationery',
      description: 'Kalem, kurşun kalem gibi yazı malzemeleri',
      itemCount: 1,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Kağıt Ürünleri',
      type: 'stationery',
      description: 'A4 kağıt, not defteri gibi kağıt ürünleri',
      itemCount: 1,
      active: true,
      createdAt: new Date().toISOString(),
    },
  ],
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.items.push(action.payload)
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex((cat) => cat.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((cat) => cat.id !== action.payload)
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload
    },
    toggleCategoryStatus: (state, action: PayloadAction<string>) => {
      const category = state.items.find((cat) => cat.id === action.payload)
      if (category) {
        category.active = !category.active
      }
    },
  },
})

export const { addCategory, updateCategory, deleteCategory, setCategories, toggleCategoryStatus } = categoriesSlice.actions
export default categoriesSlice.reducer
