import { Suspense } from "react"
import Link from "next/link"
import { ChefHat } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import IngredientSelector from "@/components/ingredient-selector"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">What Can I Cook?</h1>
        </div>
        <p className="text-muted-foreground">Select the ingredients you have, and we'll show you what you can make!</p>
      </header>

      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-6">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <IngredientSelector />
          </Suspense>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Link href="/about">
          <Button variant="link">How it works</Button>
        </Link>
      </div>
    </div>
  )
}

