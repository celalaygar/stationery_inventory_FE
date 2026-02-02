'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Package, Layers, BarChart3, Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Kontrol Paneli',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    name: 'Kitap Yönetimi',
    href: '/dashboard/books',
    icon: BookOpen,
  },
  {
    name: 'Kırtasiye Yönetimi',
    href: '/dashboard/stationery',
    icon: Package,
  },
  {
    name: 'Kategoriler',
    href: '/dashboard/categories',
    icon: Layers,
  },
]

function SidebarContent({ isCollapsed = false, onNavigate }: { isCollapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={cn(
          'border-b border-sidebar-border flex items-center justify-between transition-all duration-300',
          isCollapsed ? 'p-4' : 'p-6'
        )}
      >
        {!isCollapsed && (
          <div>
            <h1 className="text-2xl font-bold text-sidebar-foreground">KK Yönetim</h1>
            <p className="text-sm text-sidebar-foreground/60 mt-1">Kütüphane & Kırtasiye</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1 transition-all duration-300', isCollapsed ? 'p-2' : 'p-4 space-y-2')}>
        {navigation.map((item) => {
          const isActive = pathname === item.href 
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center rounded-lg transition-colors font-medium',
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-2',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        className={cn(
          'border-t border-sidebar-border text-xs text-sidebar-foreground/60 transition-all duration-300',
          isCollapsed ? 'p-2 text-center' : 'p-4'
        )}
      >
        {!isCollapsed && <p>© 2024 Tüm Hakları Saklıdır</p>}
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  // Detect if we're on mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Auto-close sidebar on mobile on mount
      if (mobile) {
        setIsCollapsed(false)
        setMobileSheetOpen(false)
      }
    }

    checkMobile()

    // Listen for window resize
    const handleResize = () => {
      checkMobile()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mobile: Drawer/Sheet mode
  if (isMobile) {
    return (
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetTrigger asChild>
          <button
            className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
            aria-label="Menüyü aç"
          >
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-r border-sidebar-border">
          <SidebarContent isCollapsed={false} onNavigate={() => setMobileSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Collapsible sidebar
  return (
    <aside
      className={cn(
        'bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <div className="p-4 border-b border-sidebar-border flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
          aria-label={isCollapsed ? 'Menüyü aç' : 'Menüyü kapat'}
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      <SidebarContent isCollapsed={isCollapsed} />
    </aside>
  )
}
