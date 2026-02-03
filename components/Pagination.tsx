'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className
}: PaginationProps) {
    // Sayfa numaralarını hesapla (Örn: [1, 2, 3, 4, 5])
    const getPageNumbers = () => {
        const pages = []
        const showMax = 3 // Mobilde kaç tane yan yana görünsün

        let start = Math.max(0, currentPage - 1)
        let end = Math.min(totalPages - 1, start + showMax - 1)

        if (end - start < showMax - 1) {
            start = Math.max(0, end - showMax + 1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }
        return pages
    }

    if (totalPages <= 1) return null

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4", className)}>
            {/* Bilgi Metni */}
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
                Toplam <span className="font-semibold">{totalPages}</span> sayfadan <span className="font-semibold text-foreground">{currentPage + 1}</span>. sayfa
            </div>

            {/* Kontroller */}
            <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                {/* İlk Sayfa - Sadece Masaüstü */}
                <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex"
                    onClick={() => onPageChange(0)}
                    disabled={currentPage === 0}
                >
                    İlk
                </Button>

                {/* Geri */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* Sayfa Numaraları */}
                <div className="flex items-center gap-1 mx-1">
                    {getPageNumbers().map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className={cn(
                                "w-9 h-9 p-0 text-sm",
                                currentPage === page ? "pointer-events-none" : ""
                            )}
                            onClick={() => onPageChange(page)}
                        >
                            {page + 1}
                        </Button>
                    ))}
                    {/* Mobilde son sayfa çok uzaksa üç nokta gösterilebilir */}
                    {totalPages > 5 && !getPageNumbers().includes(totalPages - 1) && (
                        <span className="text-muted-foreground px-1 hidden sm:inline">...</span>
                    )}
                </div>

                {/* İleri */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Son Sayfa - Sadece Masaüstü */}
                <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex"
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                >
                    Son
                </Button>
            </div>
        </div>
    )
}