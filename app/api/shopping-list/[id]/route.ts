import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

const updateListSchema = z.object({
  name: z.string().min(1),
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const listId = params.id

    // Verify that the list belongs to the user
    const list = await prisma.shoppingList.findUnique({
      where: { id: listId },
    })

    if (!list || list.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized or list not found" }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateListSchema.parse(body)

    // Update shopping list
    const updatedList = await prisma.shoppingList.update({
      where: { id: listId },
      data: {
        name: validatedData.name,
      },
    })

    return NextResponse.json(updatedList, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid data", errors: error.errors }, { status: 400 })
    }

    console.error("Shopping list update error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const listId = params.id

    // Verify that the list belongs to the user
    const list = await prisma.shoppingList.findUnique({
      where: { id: listId },
    })

    if (!list || list.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized or list not found" }, { status: 404 })
    }

    // Delete shopping list and all its items
    await prisma.shoppingList.delete({
      where: { id: listId },
    })

    return NextResponse.json({ message: "Shopping list deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Shopping list deletion error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

