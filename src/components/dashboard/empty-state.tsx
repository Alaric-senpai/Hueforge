"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Palette, Plus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center h-[400px]">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Palette className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No palettes yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        You haven&apos;t saved any palettes. Get started by creating a new one.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/">
            <Plus className="mr-2 h-4 w-4" />
            Create Palette
          </Link>
        </Button>
      </div>
    </div>
  );
}
