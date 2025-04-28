"use client"

import { useState } from "react"
import { Loader2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface AIImageGeneratorProps {
  recipeName: string
  ingredients: string[]
  onImageGenerated: (imageUrl: string) => void
}

export function AIImageGenerator({ recipeName, ingredients, onImageGenerated }: AIImageGeneratorProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function generateImage() {
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeName,
          ingredients: ingredients.slice(0, 5), // Limit to first 5 ingredients for better results
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      onImageGenerated(data.imageUrl)

      toast({
        title: "Image generated",
        description: "AI has created a beautiful image for your recipe.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Could not generate an image. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={generateImage} disabled={isLoading} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating image...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate AI Image
        </>
      )}
    </Button>
  )
}

