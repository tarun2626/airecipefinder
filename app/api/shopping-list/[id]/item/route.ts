import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

const createItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().nullable(),
  recipeId: z.string().optional(),
})

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const listId = params.id

    // Verify that the list belongs to the user
    const list = await prisma.shoppingList.findUnique({
      where: { id: listId },
      include: { user: true },
    })

    if (!list || list.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized or list not found" }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = createItemSchema.parse(body)

    // Create shopping list item
    const item = await prisma.shoppingListItem.create({
      data: {
        name: validatedData.name,
        quantity: validatedData.quantity,
        recipeId: validatedData.recipeId,
        shoppingListId: listId,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid data", errors: error.errors }, { status: 400 })
    }

    console.error("Shopping list item creation error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

