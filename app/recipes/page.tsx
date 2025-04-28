import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import RecipeResults from "@/components/recipe-results"
import { Skeleton } from "@/components/ui/skeleton"

export default function RecipesPage({
  searchParams,
}: {
  searchParams: {
    ingredients?: string | string[]
    diet?: string | string[]
    cuisine?: string | string[]
  }
}) {
  const ingredients = Array.isArray(searchParams.ingredients)
    ? searchParams.ingredients
    : searchParams.ingredients
      ? [searchParams.ingredients]
      : []

  const dietaryFilters = Array.isArray(searchParams.diet)
    ? searchParams.diet
    : searchParams.diet
      ? [searchParams.diet]
      : []

  const cuisineFilters = Array.isArray(searchParams.cuisine)
    ? searchParams.cuisine
    : searchParams.cuisine
      ? [searchParams.cuisine]
      : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="pl-0">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to ingredients
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Recipe Results</h1>

        {ingredients.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Recipes with your ingredients:</h2>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <span key={ingredient} className="bg-muted px-2 py-1 rounded-md text-sm">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {dietaryFilters.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Dietary Filters:</h2>
                <div className="flex flex-wrap gap-2">
                  {dietaryFilters.map((filter) => (
                    <span key={filter} className="bg-primary/10 px-2 py-1 rounded-md text-sm">
                      {filter}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {cuisineFilters.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Cuisine Filters:</h2>
                <div className="flex flex-wrap gap-2">
                  {cuisineFilters.map((cuisine) => (
                    <span key={cuisine} className="bg-secondary/10 px-2 py-1 rounded-md text-sm">
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Suspense fallback={<RecipeResultsSkeleton />}>
              <RecipeResults
                ingredients={ingredients}
                dietaryFilters={dietaryFilters}
                cuisineFilters={cuisineFilters}
              />
            </Suspense>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No ingredients selected. Please go back and select some ingredients.
            </p>
            <Link href="/">
              <Button className="mt-4">Select Ingredients</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function RecipeResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

