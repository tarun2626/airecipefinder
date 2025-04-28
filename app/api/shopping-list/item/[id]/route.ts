import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

const updateItemSchema = z.object({
  name: z.string().min(1).optional(),
  quantity: z.string().nullable().optional(),
  checked: z.boolean().optional(),
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const itemId = params.id

    // Verify that the item belongs to the user's list
    const item = await prisma.shoppingListItem.findUnique({
      where: { id: itemId },
      include: { shoppingList: true },
    })

    if (!item || item.shoppingList.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized or item not found" }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateItemSchema.parse(body)

    // Update shopping list item
    const updatedItem = await prisma.shoppingListItem.update({
      where: { id: itemId },
      data: validatedData,
    })

    return NextResponse.json(updatedItem, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid data", errors: error.errors }, { status: 400 })
    }

    console.error("Shopping list item update error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const itemId = params.id

    // Verify that the item belongs to the user's list
    const item = await prisma.shoppingListItem.findUnique({
      where: { id: itemId },
      include: { shoppingList: true },
    })

    if (!item || item.shoppingList.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized or item not found" }, { status: 404 })
    }

    // Delete shopping list item
    await prisma.shoppingListItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Shopping list item deletion error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

