"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2, Edit, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deletePalette } from "@/lib/actions";
import type { Palette } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "../ui/badge";

interface PaletteCardProps {
  palette: Palette;
}

export function PaletteCard({ palette }: PaletteCardProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    const result = await deletePalette(palette.id);
    if (result.success) {
      toast({ title: "Palette deleted successfully." });
      // The page will be revalidated, but for a smoother UX, we can optimistically update the UI or refresh.
      // For now, we rely on revalidation or a page refresh.
    } else {
      toast({ title: "Error deleting palette", description: result.error, variant: "destructive" });
    }
    setShowDeleteAlert(false);
  };
  
  const handleCopy = (format: 'css' | 'json') => {
    let content = '';
    if (format === 'css') {
        content = palette.colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n');
    } else {
        content = JSON.stringify(palette.colors.map(c => c.hex), null, 2);
    }
    navigator.clipboard.writeText(content);
    toast({ title: `Copied as ${format.toUpperCase()}` });
  };


  return (
    <>
      <Card>
        <CardHeader className="p-0">
          <div className="flex h-32 w-full overflow-hidden rounded-t-lg">
            {palette.colors.map((color, index) => (
              <div
                key={index}
                className="h-full w-1/5"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-4">
            <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{palette.name}</CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit (soon)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopy('css')}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy CSS
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopy('json')}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => setShowDeleteAlert(true)}
                        className="text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          <p className="text-sm text-muted-foreground truncate">{palette.description || "No description."}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-wrap gap-1">
            {palette.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
            {palette.tags.length > 3 && <Badge variant="outline">+{palette.tags.length - 3}</Badge>}
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              palette "{palette.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
