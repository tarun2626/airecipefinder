"use client"

import { useState } from "react"
import { Trash2, Plus, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AddItemDialog } from "./add-item-dialog"
import { EditListDialog } from "./edit-list-dialog"

interface ShoppingListItem {
  id: string
  name: string
  quantity: string | null
  checked: boolean
}

interface ShoppingList {
  id: string
  name: string
  items: ShoppingListItem[]
}

interface ShoppingListViewProps {
  shoppingList: ShoppingList
}

export function ShoppingListView({ shoppingList }: ShoppingListViewProps) {
  const { toast } = useToast()
  const [list, setList] = useState(shoppingList)
  const [isDeleting, setIsDeleting] = useState(false)

  async function toggleItemChecked(itemId: string, checked: boolean) {
    try {
      const response = await fetch(`/api/shopping-list/item/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checked }),
      })

      if (!response.ok) {
        throw new Error("Failed to update item")
      }

      setList((current) => ({
        ...current,
        items: current.items.map((item) => (item.id === itemId ? { ...item, checked } : item)),
      }))
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update the item. Please try again.",
      })
    }
  }

  async function deleteList() {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/shopping-list/${list.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete list")
      }

      toast({
        title: "List deleted",
        description: "Shopping list has been deleted successfully.",
      })

      // Refresh the page to show updated lists
      window.location.reload()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Could not delete the shopping list. Please try again.",
      })
      setIsDeleting(false)
    }
  }

  const uncheckedItems = list.items.filter((item) => !item.checked)
  const checkedItems = list.items.filter((item) => item.checked)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{list.name}</CardTitle>
        <div className="flex space-x-2">
          <EditListDialog shoppingList={list} onUpdate={(updatedList) => setList(updatedList)}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit list</span>
            </Button>
          </EditListDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Delete list</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Shopping List</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this shopping list? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteList}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Items to buy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Items to Buy ({uncheckedItems.length})</h3>
              <AddItemDialog
                shoppingListId={list.id}
                onItemAdded={(newItem) => {
                  setList((current) => ({
                    ...current,
                    items: [...current.items, newItem],
                  }))
                }}
              >
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </AddItemDialog>
            </div>

            {uncheckedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items to buy</p>
            ) : (
              <ul className="space-y-2">
                {uncheckedItems.map((item) => (
                  <li key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={(checked) => toggleItemChecked(item.id, checked as boolean)}
                    />
                    <span className="flex-1">
                      {item.name}
                      {item.quantity && <span className="text-muted-foreground ml-1">({item.quantity})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Checked items */}
          {checkedItems.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Checked Items ({checkedItems.length})</h3>
              <ul className="space-y-2">
                {checkedItems.map((item) => (
                  <li key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={(checked) => toggleItemChecked(item.id, checked as boolean)}
                    />
                    <span className="flex-1 line-through text-muted-foreground">
                      {item.name}
                      {item.quantity && <span className="ml-1">({item.quantity})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

