"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, Users, AlertCircle } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { findRecipesByIngredients } from "@/lib/api"
import type { Recipe } from "@/lib/types"

export default function RecipeResults({
  ingredients,
  dietaryFilters = [],
  cuisineFilters = [],
}: {
  ingredients: string[]
  dietaryFilters?: string[]
  cuisineFilters?: string[]
}) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true)
      setError(null)

      try {
        const results = await findRecipesByIngredients(ingredients, dietaryFilters, cuisineFilters)
        setRecipes(results)
      } catch (error) {
        console.error("Failed to fetch recipes:", error)
        setError("Failed to fetch recipes. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [ingredients, dietaryFilters, cuisineFilters])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-primary/20 rounded-full mb-4"></div>
          <p>Finding recipes for you...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No recipes found</h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any recipes matching your criteria. Try selecting different ingredients or fewer filters.
        </p>
        <Link href="/">
          <Button>Modify Search</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Card key={recipe.id} className="overflow-hidden flex flex-col h-full">
          <div className="relative h-48 overflow-hidden">
            <img
              src={recipe.image || "/placeholder.svg?height=300&width=400"}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {recipe.matchPercentage}% match
              </Badge>
            </div>
          </div>
          <CardContent className="pt-6 flex-grow">
            <h3 className="text-xl font-medium mb-2">{recipe.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Clock className="mr-1 h-4 w-4" />
              <span className="mr-4">{recipe.cookTime} mins</span>
              <Users className="mr-1 h-4 w-4" />
              <span>Serves {recipe.servings}</span>
            </div>
            {recipe.cuisine && recipe.cuisine !== "Various" && <Badge className="mb-4">{recipe.cuisine}</Badge>}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Ingredients you have:</h4>
              <div className="flex flex-wrap gap-1">
                {recipe.matchedIngredients.map((ingredient) => (
                  <Badge key={ingredient} variant="outline" className="bg-primary/10">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
            {recipe.missingIngredients.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">You'll also need:</h4>
                <div className="flex flex-wrap gap-1">
                  {recipe.missingIngredients.map((ingredient) => (
                    <Badge key={ingredient} variant="outline" className="bg-muted">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Link href={`/recipes/${recipe.id}`} className="w-full">
              <Button variant="secondary" className="w-full">
                View Recipe
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

