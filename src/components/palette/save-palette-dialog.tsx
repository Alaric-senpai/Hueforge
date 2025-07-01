"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { suggestPaletteTags } from "@/ai/flows/palette-auto-tagging";
import { savePalette, updatePalette } from "@/lib/actions";
import type { Color, Palette } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type SavePaletteDialogProps = {
  colors: Color[];
  existingPalette?: Palette;
};

export function SavePaletteDialog({ colors, existingPalette }: SavePaletteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingPalette?.name ?? "",
      description: existingPalette?.description ?? "",
      tags: existingPalette?.tags.join(", ") ?? "",
    },
  });

  useEffect(() => {
    if (open && !existingPalette) {
      const getTags = async () => {
        try {
          const hexColors = colors.map(c => c.hex);
          const result = await suggestPaletteTags({ colors: hexColors });
          setSuggestedTags(result.tags);
          form.setValue("tags", result.tags.join(", "));
        } catch (error) {
          console.error("Error suggesting tags:", error);
        }
      };
      getTags();
    }
    if (existingPalette) {
      form.reset({
        name: existingPalette.name,
        description: existingPalette.description,
        tags: existingPalette.tags.join(", "),
      });
    }
  }, [open, colors, form, existingPalette]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    const tagsArray = values.tags ? values.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [];
    
    const paletteData = {
      userId: user.uid,
      name: values.name,
      description: values.description || "",
      colors,
      tags: tagsArray,
    };

    const result = existingPalette 
        ? await updatePalette(existingPalette.id, paletteData) 
        : await savePalette(paletteData);

    if (result.success) {
      toast({
        title: `Palette ${existingPalette ? 'updated' : 'saved'}!`,
        description: `Your palette "${values.name}" has been successfully ${existingPalette ? 'updated' : 'saved'}.`,
      });
      setOpen(false);
    } else {
      toast({
        title: "Something went wrong",
        description: result.error,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant={existingPalette ? "outline" : "default"} className="gap-2">
          <Save />
          {existingPalette ? 'Update Palette' : 'Save Palette'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingPalette ? 'Update' : 'Save'} Palette</DialogTitle>
          <DialogDescription>
            {existingPalette ? 'Update the details for your palette.' : 'Give your new palette a name and some tags.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sunset Bliss" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short description of the palette" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="warm, retro, summer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {suggestedTags.length > 0 && !existingPalette && (
                <div className="flex flex-wrap gap-2 items-center">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {suggestedTags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
