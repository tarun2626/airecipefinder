"use client"

import { useState } from "react"
import { Bookmark } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface FavoriteButtonProps {
  recipeId: string
  initialFavorited: boolean
}

export function FavoriteButton({ recipeId, initialFavorited }: FavoriteButtonProps) {
  const { toast } = useToast()
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)

  async function toggleFavorite() {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/favorites/${recipeId}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to update favorite status")
      }

      const { favorited } = await response.json()
      setIsFavorited(favorited)

      toast({
        title: favorited ? "Added to favorites" : "Removed from favorites",
        description: favorited
          ? "Recipe has been added to your favorites."
          : "Recipe has been removed from your favorites.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "Could not update favorite status. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size="icon"
      onClick={toggleFavorite}
      disabled={isLoading}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Bookmark className={isFavorited ? "fill-current" : ""} />
      <span className="sr-only">{isFavorited ? "Remove from favorites" : "Add to favorites"}</span>
    </Button>
  )
}

