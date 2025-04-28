"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface AddToShoppingListButtonProps {
  userId: string
  recipeId: string
  recipeTitle: string
}

export function AddToShoppingListButton({ userId, recipeId, recipeTitle }: AddToShoppingListButtonProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [listName, setListName] = useState(`Ingredients for ${recipeTitle}`)

  async function addToShoppingList() {
    setIsLoading(true)

    try {
      const response = await fetch("/api/shopping-list/from-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          recipeId,
          listName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create shopping list")
      }

      toast({
        title: "Shopping list created",
        description: "Ingredients have been added to a new shopping list.",
      })

      setOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create list",
        description: "Could not create shopping list. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Shopping List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Shopping List</DialogTitle>
          <DialogDescription>Create a new shopping list with all ingredients from this recipe.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="list-name">List Name</Label>
          <Input id="list-name" value={listName} onChange={(e) => setListName(e.target.value)} className="mt-2" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={addToShoppingList} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create List
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

