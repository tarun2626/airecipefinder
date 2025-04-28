import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

const createListSchema = z.object({
  name: z.string().min(1),
  userId: z.string(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createListSchema.parse(body)

    // Verify that the userId matches the session user
    if (validatedData.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Create shopping list
    const shoppingList = await prisma.shoppingList.create({
      data: {
        name: validatedData.name,
        userId: validatedData.userId,
      },
    })

    return NextResponse.json(shoppingList, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid data", errors: error.errors }, { status: 400 })
    }

    console.error("Shopping list creation error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

