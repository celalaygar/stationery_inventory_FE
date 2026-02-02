'use client'

import { useAppSelector } from '@/lib/hooks'
import StatCard from '@/components/stat-card'
import RecentItemsCard from '@/components/recent-items-card'
import { BookOpen, Package, Layers, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { getBookTotalCountHelper, getTotalPriceHelper } from '@/lib/service/helper/books-helper'
import { Category } from '@/lib/slices/categoriesSlice'
import { getCategoriesHelper } from '@/lib/service/helper/category-helper'

export default function DashboardPage() {
  const bookItems = useAppSelector((state) => state.books.items)
  const stationeryItems = useAppSelector((state) => state.stationery.items)
  const [categories, setCategories] = useState<Category[]>([])
  const [totalBooks, setTotalBooks] = useState<number>(0)
  const [totalStationery, setTotalStationery] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const [loading, setLoading] = useState(false)

  const getCategories = useCallback(async () => {
    const response: Category[] | null = await getCategoriesHelper({ setLoading: setLoading });
    if (response !== null) {
      setCategories(response);
    } else {
      setCategories([]);
    }
  }, []);

  const getBookTotalCount = useCallback(async () => {
    const response: number | null = await getBookTotalCountHelper({ setLoading: setLoading });
    if (response !== null) {
      setTotalBooks(response);
    } else {
      setTotalBooks(0);
    }
  }, []);


  const getTotalPrice = useCallback(async () => {
    const response: number | null = await getTotalPriceHelper({ setLoading: setLoading });
    if (response !== null) {
      setTotalPrice(response);
    } else {
      setTotalPrice(0);
    }
  }, []);


  useEffect(() => {
    getCategories();
    getBookTotalCount();
    getTotalPrice();
  }, [getBookTotalCount, getTotalPrice, getCategories]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Kontrol Paneli</h1>
        <p className="text-muted-foreground mt-2">Envanter durumunuza genel bir bakış</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Kitaplar"
          value={totalBooks}
          icon={BookOpen}
          change="+2.5%"
          changePositive={true}
        />
        <StatCard
          title="Kırtasiye Ürünleri"
          value={totalStationery}
          icon={Package}
          change="+1.2%"
          changePositive={true}
        />
        <StatCard
          title="Kategoriler"
          value={categories.length}
          icon={Layers}
          change="3 aktif"
          changePositive={true}
        />
        <StatCard
          title="Toplam Değer"
          value={`₺${totalPrice}`}
          icon={TrendingUp}
          change="+5.1%"
          changePositive={true}
        />
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentItemsCard
          title="Son Eklenen Kitaplar"
          items={bookItems.slice(0, 0).map((book) => ({
            id: book.id,
            name: book.title,
            category: book.category,
            stockCount: book.stockCount,
            price: book.price,
          }))}
          type="book"
        />
        <RecentItemsCard
          title="Son Eklenen Kırtasiye"
          items={stationeryItems.slice(0, 0).map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            stockCount: item.stockCount,
            price: item.price,
          }))}
          type="stationery"
        />
      </div>
    </div>
  )
}
