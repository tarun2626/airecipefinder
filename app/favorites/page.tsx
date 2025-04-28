import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { ChevronLeft, Clock, Users } from "lucide-react"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUserFavoriteRecipes } from "@/lib/favorites"

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const favoriteRecipes = await getUserFavoriteRecipes(session.user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="pl-0">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Your Favorite Recipes</h1>

        {favoriteRecipes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No favorite recipes yet</h3>
            <p className="text-muted-foreground mb-6">Start exploring recipes and save your favorites</p>
            <Link href="/">
              <Button>Find Recipes</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="pt-6 flex-grow">
                  <h3 className="text-xl font-medium mb-2">{recipe.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Clock className="mr-1 h-4 w-4" />
                    <span className="mr-4">{recipe.cookTime} mins</span>
                    <Users className="mr-1 h-4 w-4" />
                    <span>Serves {recipe.servings}</span>
                  </div>
                  {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {recipe.dietaryTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-primary/10">
                          {tag}
                        </Badge>
                      ))}
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
        )}
      </div>
    </div>
  )
}

