import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { Plus } from "lucide-react"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingListView } from "@/components/shopping-list/shopping-list-view"
import { CreateShoppingListDialog } from "@/components/shopping-list/create-shopping-list-dialog"
import { getUserShoppingLists } from "@/lib/shopping-list"

export default async function ShoppingListPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const shoppingLists = await getUserShoppingLists(session.user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Shopping Lists</h1>
          <CreateShoppingListDialog userId={session.user.id}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New List
            </Button>
          </CreateShoppingListDialog>
        </div>

        {shoppingLists.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Shopping Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You don't have any shopping lists yet. Create one to get started.
              </p>
              <CreateShoppingListDialog userId={session.user.id}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Shopping List
                </Button>
              </CreateShoppingListDialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {shoppingLists.map((list) => (
              <ShoppingListView key={list.id} shoppingList={list} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

