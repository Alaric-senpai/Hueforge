"use client";

import { useState, useEffect, useCallback } from "react";
import { generateRandomHex } from "@/lib/color-utils";
import { ColorColumn } from "./palette/color-column";
import type { Color, Palette } from "@/types";
import { SavePaletteDialog } from "./palette/save-palette-dialog";
import { Button } from "./ui/button";
import { RotateCw, Save } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

const INITIAL_PALETTE: Color[] = [
  { hex: "#F94144", isLocked: false },
  { hex: "#F3722C", isLocked: false },
  { hex: "#F8961E", isLocked: false },
  { hex: "#F9C74F", isLocked: false },
  { hex: "#90BE6D", isLocked: false },
];

export function PaletteGenerator({ initialPalette }: { initialPalette?: Palette }) {
  const [colors, setColors] = useState<Color[]>(initialPalette?.colors ?? INITIAL_PALETTE);
  const { user } = useAuth();
  const { toast } = useToast();

  const generatePalette = useCallback(() => {
    setColors((prevColors) =>
      prevColors.map((color) =>
        color.isLocked ? color : { ...color, hex: generateRandomHex() }
      )
    );
  }, []);

  useEffect(() => {
    if (!initialPalette) {
      generatePalette();
    }
  }, [generatePalette, initialPalette]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        generatePalette();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generatePalette]);

  const toggleLock = (index: number) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, isLocked: !c.isLocked } : c))
    );
  };

  const handleColorChange = (index: number, newHex: string) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, hex: newHex } : c))
    );
  };
  
  const handleSaveClick = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to save palettes.",
        variant: "destructive",
        action: <Button asChild><Link href="/login">Login</Link></Button>,
      });
    }
  };

  const placements = [
    "md:col-span-2 md:row-span-3",
    "md:col-start-3 md:col-span-2 md:row-span-2",
    "md:col-start-1 md:row-start-4 md:col-span-1 md:row-span-2",
    "md:col-start-2 md:row-start-4 md:col-span-3 md:row-span-2",
    "md:col-start-3 md:row-start-3 md:col-span-2 md:row-span-1",
  ];

  return (
    <main className="flex-1 flex flex-col w-4/5 m-auto">
      <div className="flex-1 p-2 flex flex-col gap-2 md:grid md:grid-cols-4 md:grid-rows-5">
        {colors.map((color, index) => (
          <ColorColumn
            key={index}
            className={cn("min-h-[15vh] md:min-h-0", placements[index])}
            color={color}
            onToggleLock={() => toggleLock(index)}
            onColorChange={(newHex) => handleColorChange(index, newHex)}
          />
        ))}
      </div>
      <div className="container mx-auto flex justify-center items-center py-4 md:py-6 gap-4 border-t bg-background">
        <Button onClick={generatePalette} size="lg" className="gap-2">
          <RotateCw />
          Generate Palette
        </Button>
        {user ? (
          <SavePaletteDialog colors={colors} existingPalette={initialPalette} />
        ) : (
          <Button onClick={handleSaveClick} size="lg" variant="secondary" className="gap-2">
            <Save />
            Save Palette
          </Button>
        )}
      </div>
    </main>
  );
}
