"use server";

import { revalidatePath } from "next/cache";
import { db, collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc, serverTimestamp } from "./firebase-admin";
import type { Palette, PaletteData } from "@/types";

export async function savePalette(paletteData: Omit<Palette, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; error?: string }> {
  try {
    const paletteWithTimestamps = {
      ...paletteData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await addDoc(collection(db, "palettes"), paletteWithTimestamps);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePalette(paletteId: string, paletteData: Partial<PaletteData>): Promise<{ success: boolean; error?: string }> {
  try {
    const paletteRef = doc(db, "palettes", paletteId);
    const paletteWithTimestamp = {
      ...paletteData,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(paletteRef, paletteWithTimestamp);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserPalettes(userId: string): Promise<Palette[]> {
  try {
    const q = query(collection(db, "palettes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const palettes = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      } as Palette;
    });
    return palettes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error getting palettes:", error);
    return [];
  }
}

export async function deletePalette(paletteId: string): Promise<{ success: boolean, error?: string }> {
    try {
        await deleteDoc(doc(db, "palettes", paletteId));
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
