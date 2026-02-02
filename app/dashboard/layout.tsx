import React from "react"
import Sidebar from '@/components/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (overlay) */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 px-4 pt-16 md:pt-6">{children}</div>
      </main>
    </div>
  )
}
