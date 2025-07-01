"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getUserPalettes } from "@/lib/actions";
import type { Palette } from "@/types";
import { PaletteCard } from "./palette-card";
import { EmptyState } from "./empty-state";
import { Skeleton } from "../ui/skeleton";

export function PaletteGrid() {
  const { user } = useAuth();
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchPalettes = async () => {
        setLoading(true);
        const userPalettes = await getUserPalettes(user.uid);
        setPalettes(userPalettes);
        setLoading(false);
      };
      fetchPalettes();
    }
  }, [user]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (palettes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {palettes.map((palette) => (
        <PaletteCard key={palette.id} palette={palette} />
      ))}
    </div>
  );
}

function DashboardSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    )
}
