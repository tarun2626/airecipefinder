"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ChefHat, Search, Heart, ShoppingCart, User, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavBar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const isActive = (path: string) => pathname === path

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">What Can I Cook?</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/">
            <Button variant={isActive("/") ? "default" : "ghost"}>
              <Search className="mr-2 h-4 w-4" />
              Find Recipes
            </Button>
          </Link>

          {status === "authenticated" ? (
            <>
              <Link href="/favorites">
                <Button variant={isActive("/favorites") ? "default" : "ghost"}>
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
              </Link>
              <Link href="/shopping-list">
                <Button variant={isActive("/shopping-list") ? "default" : "ghost"}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Shopping Lists
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    {session.user.name || "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">Open menu</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 6H20M4 12H20M4 18H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <Link href="/">
                <DropdownMenuItem>
                  <Search className="mr-2 h-4 w-4" />
                  Find Recipes
                </DropdownMenuItem>
              </Link>

              {status === "authenticated" ? (
                <>
                  <Link href="/favorites">
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/shopping-list">
                    <DropdownMenuItem>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Shopping Lists
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <DropdownMenuItem>Sign In</DropdownMenuItem>
                  </Link>
                  <Link href="/register">
                    <DropdownMenuItem>Sign Up</DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

