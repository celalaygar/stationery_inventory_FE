import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Stationery {
  id: string
  name: string
  category: string
  price: number
  stockCount: number
  createdAt: string
}

interface StationeryState {
  items: Stationery[]
  total: number
}

const initialState: StationeryState = {
  items: [
    {
      id: '1',
      name: 'Tükenmez Kalem (Mavi)',
      category: 'Yazı Araçları',
      price: 5.99,
      stockCount: 150,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'A4 Kağıt Resmi (500 sayfa)',
      category: 'Kağıt Ürünleri',
      price: 45.99,
      stockCount: 250,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Defter (200 sayfa)',
      category: 'Kağıt Ürünleri',
      price: 15.50,
      stockCount: 80,
      createdAt: new Date().toISOString(),
    },
  ],
  total: 480,
}

const stationerySlice = createSlice({
  name: 'stationery',
  initialState,
  reducers: {
    addStationery: (state, action: PayloadAction<Stationery>) => {
      state.items.push(action.payload)
      state.total += action.payload.stockCount
    },
    updateStationery: (state, action: PayloadAction<Stationery>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        const oldstockCount = state.items[index].stockCount
        state.items[index] = action.payload
        state.total = state.total - oldstockCount + action.payload.stockCount
      }
    },
    deleteStationery: (state, action: PayloadAction<string>) => {
      const item = state.items.find((s) => s.id === action.payload)
      if (item) {
        state.total -= item.stockCount
        state.items = state.items.filter((s) => s.id !== action.payload)
      }
    },
    setStationery: (state, action: PayloadAction<Stationery[]>) => {
      state.items = action.payload
      state.total = action.payload.reduce((sum, item) => sum + item.stockCount, 0)
    },
  },
})

export const { addStationery, updateStationery, deleteStationery, setStationery } = stationerySlice.actions
export default stationerySlice.reducer
