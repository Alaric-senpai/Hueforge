"use client";

import Link from "next/link";
import { Palette, LayoutGrid, LogIn, UserPlus, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";
import { firebaseSignOut, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Themetoggler from "./themetoggler";

export function Header() {
  const { setTheme, theme } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await firebaseSignOut(auth);
    router.push("/");
  };

  return (
    <header className="sticky top-2 mb-4 px-3 z-50 text-white rounded-full shadow-md flex items-center justify-between  w-4/5 m-auto bg-primary">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={'/images/logo.png'} width={20} height={20} alt="logo img" />
            <span className="font-bold sm:inline-block">Hue forge</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          {loading ? (
            <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
          ) : user ? (
              <Themetoggler />
          ) : (
            <nav className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button asChild>
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
