import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/hooks/use-auth";
import { PaletteGrid } from "@/components/dashboard/palette-grid";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Your saved color palettes.</p>
            </div>
            <Suspense fallback={<DashboardSkeleton />}>
                <PaletteGrid />
            </Suspense>
        </main>
      </div>
    </ProtectedRoute>
  );
}


function DashboardSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    )
}
