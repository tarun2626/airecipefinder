import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Clock, Users, Bookmark, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getRecipeById } from "@/lib/api"

export default async function RecipePage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const recipe = await getRecipeById(params.id)

    if (!recipe) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/recipes">
              <Button variant="ghost" className="pl-0">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to results
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{recipe.cookTime} mins</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>Serves {recipe.servings}</span>
                </div>
                {recipe.cuisine && recipe.cuisine !== "Various" && (
                  <Badge variant="outline" className="ml-auto">
                    {recipe.cuisine}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-6">{recipe.description}</p>
              <Button className="mb-6">
                <Bookmark className="mr-2 h-4 w-4" />
                Save Recipe
              </Button>
            </div>
            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={recipe.image || "/placeholder.svg?height=300&width=400"}
                  alt={recipe.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium mb-4">Ingredients</h2>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium mb-4">Instructions</h2>
                  {recipe.instructions.length > 0 ? (
                    <ol className="space-y-4">
                      {recipe.instructions.map((step, index) => (
                        <li key={index}>
                          <div className="flex items-start">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium mr-3 shrink-0">
                              {index + 1}
                            </span>
                            <p>{step}</p>
                          </div>
                          {index < recipe.instructions.length - 1 && <Separator className="mt-4" />}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-muted-foreground">No instructions available for this recipe.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/recipes">
              <Button variant="ghost" className="pl-0">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to results
              </Button>
            </Link>
          </div>

          <Alert variant="destructive" className="my-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load recipe details. Please try again later.</AlertDescription>
          </Alert>

          <div className="text-center mt-8">
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

