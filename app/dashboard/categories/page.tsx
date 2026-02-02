'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { addCategory, updateCategory, deleteCategory, toggleCategoryStatus, CategoryTypes } from '@/lib/slices/categoriesSlice'
import CategoriesGrid from '@/components/categories-grid'
import CategoryDialog from '@/components/category-dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Book, ShoppingCart, Loader2 } from 'lucide-react'
import { Category } from '@/lib/slices/categoriesSlice'
import CategoryForm from '@/components/category-form' // Declare the CategoryForm variable
import { CategoryResponse } from '@/lib/model/category'
import { createCategoryHelper, getCategoriesHelper, updateCategoryHelper, updateCategoryStatusHelper } from '@/lib/service/helper/category-helper'

export default function CategoriesPage() {
  const dispatch = useAppDispatch()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false) // Declare the showForm variable

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCategory(null)
  }



  const handleDeleteCategory = (id: string) => {
    if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      dispatch(deleteCategory(id))
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingCategory(null)
    }
  }

  const [bookCategories, setBookCategories] = useState<Category[]>([])
  const [stationeryCategories, setStationeryCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)


  const getCategories = useCallback(async () => {
    setBookCategories([]) // Clear previous categories
    const response: Category[] | null = await getCategoriesHelper({ setLoading: setLoadingCategories });
    if (response !== null) {
      setBookCategories(response.filter((c) => c.type === CategoryTypes.BOOKS));
      setStationeryCategories(response.filter((c) => c.type === CategoryTypes.STATIONERY));
    } else {
      setBookCategories([]);
      setStationeryCategories([]);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories])

  const handleAddCategory = async (category: Category) => {
    const newCategory: Category = {
      ...category,
      itemCount: 0,
    }

    const response: Category | null = await createCategoryHelper(newCategory, { setLoading: setLoadingCategories });
    if (response) {
      if (response.type === CategoryTypes.BOOKS) {
        if (editingCategory) {
          setBookCategories((prevCategories) =>
            prevCategories.map((cat) => (cat.id === response.id ? response : cat))
          );
        } else {
          setBookCategories((prevCategories) => [...prevCategories, response]);
        }
      } else if (response.type === CategoryTypes.STATIONERY) {
        if (editingCategory) {
          setStationeryCategories((prevCategories) =>
            prevCategories.map((cat) => (cat.id === response.id ? response : cat))
          );
        } else {
          setStationeryCategories((prevCategories) => [...prevCategories, response]);
        }
      }
    }
    setDialogOpen(false)
  }

  const handleUpdateCategory = async (category: Category) => {

    console.log("Updating category:", category);
    const response: Category | null = await updateCategoryHelper(category.id, category, { setLoading: setLoadingCategories });
    if (response) {
      if (response.type === CategoryTypes.BOOKS) {
        setBookCategories((prevCategories) =>
          prevCategories.map((cat) => (cat.id === response.id ? response : cat))
        );

      } else if (response.type === CategoryTypes.STATIONERY) {
        setStationeryCategories((prevCategories) =>
          prevCategories.map((cat) => (cat.id === response.id ? response : cat))
        );
      }
    }
    setEditingCategory(null)
    setDialogOpen(false)
  }


  const handleToggleStatus = async (id: string, active: boolean) => {

    const response: Category | null = await updateCategoryStatusHelper(id, !active, { setLoading: setLoadingCategories });
    if (response) {
      if (response.type === CategoryTypes.BOOKS) {
        setBookCategories((prevCategories) =>
          prevCategories.map((cat) => (cat.id === response.id ? response : cat))
        );

      } else if (response.type === CategoryTypes.STATIONERY) {
        setStationeryCategories((prevCategories) =>
          prevCategories.map((cat) => (cat.id === response.id ? response : cat))
        );
      }
    }

  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kategoriler</h1>
          <p className="text-muted-foreground mt-2">Kitap ve kırtasiye kategorilerini yönetin</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Yeni Kategori Ekle
        </Button>
      </div>



      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Toplam Kategori</p>
          <p className="text-2xl font-bold text-foreground mt-2">{bookCategories.length + stationeryCategories.length}</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Kitap Kategoriler</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{bookCategories.filter((c) => c.active).length}</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Kırtasiye Kategoriler</p>
          <p className="text-2xl font-bold text-muted-foreground mt-2">{stationeryCategories.filter((c) => c.active).length}</p>
        </div>
      </div>

      {/* Dialog */}
      <CategoryDialog
        open={dialogOpen}
        category={editingCategory || undefined}
        onOpenChange={handleDialogOpenChange}
        onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
      />

      {/* Tabs for Book and Stationery Categories */}
      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="books" className="gap-2">
            <Book className="w-4 h-4" />
            <span className="hidden sm:inline">Kitap Kategorileri</span>
            <span className="sm:hidden">Kitaplar</span>
            <span className="ml-1 text-xs bg-primary/20 px-2 py-0.5 rounded-full">{bookCategories.length}</span>
          </TabsTrigger>
          <TabsTrigger value="stationery" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Kırtasiye Kategorileri</span>
            <span className="sm:hidden">Kırtasiye</span>
            <span className="ml-1 text-xs bg-primary/20 px-2 py-0.5 rounded-full">{stationeryCategories.length}</span>
          </TabsTrigger>
        </TabsList>
        {
          loadingCategories ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
              <TabsContent value="books" className="space-y-4">
                {bookCategories.length === 0 ? (
                  <div className="text-center py-12 bg-muted/50 rounded-lg border border-border">
                    <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Henüz kitap kategorisi eklenmemiş</p>
                    <Button className="mt-4 gap-2" onClick={() => setDialogOpen(true)}>
                      <Plus className="w-4 h-4" />
                      İlk Kategoriyi Ekle
                    </Button>
                  </div>
                ) : (
                  <CategoriesGrid
                    categories={bookCategories}
                    onEdit={handleEdit}
                    onDelete={handleDeleteCategory}
                    onToggleStatus={handleToggleStatus}
                  />
                )}
              </TabsContent>

              <TabsContent value="stationery" className="space-y-4">
                {stationeryCategories.length === 0 ? (
                  <div className="text-center py-12 bg-muted/50 rounded-lg border border-border">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Henüz kırtasiye kategorisi eklenmemiş</p>
                    <Button className="mt-4 gap-2" onClick={() => setDialogOpen(true)}>
                      <Plus className="w-4 h-4" />
                      İlk Kategoriyi Ekle
                    </Button>
                  </div>
                ) : (
                  <CategoriesGrid
                    categories={stationeryCategories}
                    onEdit={handleEdit}
                    onDelete={handleDeleteCategory}
                    onToggleStatus={handleToggleStatus}
                  />
                )}
              </TabsContent>
            </>
          )
        }
      </Tabs>


    </div>
  )
}
