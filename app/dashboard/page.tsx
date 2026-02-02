'use client'

import { useAppSelector } from '@/lib/hooks'
import StatCard from '@/components/stat-card'
import RecentItemsCard from '@/components/recent-items-card'
import { BookOpen, Package, Layers, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const bookItems = useAppSelector((state) => state.books.items)
  const stationeryItems = useAppSelector((state) => state.stationery.items)
  const categories = useAppSelector((state) => state.categories.items)

  const totalBooks = useAppSelector((state) => state.books.total)
  const totalStationery = useAppSelector((state) => state.stationery.total)
  const totalValue = (totalBooks * 75 + totalStationery * 50) / 100

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
          value={`₺${totalValue.toFixed(0)}`}
          icon={TrendingUp}
          change="+5.1%"
          changePositive={true}
        />
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentItemsCard
          title="Son Eklenen Kitaplar"
          items={bookItems.slice(0, 5).map((book) => ({
            id: book.id,
            name: book.title,
            category: book.category,
            quantity: book.quantity,
            price: book.price,
          }))}
          type="book"
        />
        <RecentItemsCard
          title="Son Eklenen Kırtasiye"
          items={stationeryItems.slice(0, 5).map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            price: item.price,
          }))}
          type="stationery"
        />
      </div>
    </div>
  )
}
