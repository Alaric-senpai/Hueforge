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
      if (e.code === "Space" && !(e.target instanceof HTMLInputElement)) {
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

  return (
    <main className="flex-1 flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-5">
        {colors.map((color, index) => (
          <ColorColumn
            key={index}
            color={color}
            onToggleLock={() => toggleLock(index)}
            onColorChange={(newHex) => handleColorChange(index, newHex)}
          />
        ))}
      </div>
      <div className="container mx-auto flex justify-center items-center py-4 md:py-6 gap-4 bg-background/80 backdrop-blur-sm">
        <Button onClick={generatePalette} size="lg" className="gap-2">
          <RotateCw />
          Regenerate Palette
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
