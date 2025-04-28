import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = profileSchema.parse(body)

    // Check if email is already taken by another user
    if (validatedData.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json({ message: "Email is already taken" }, { status: 409 })
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
      },
    })

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json({ message: "Profile updated successfully", user: userWithoutPassword }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid data", errors: error.errors }, { status: 400 })
    }

    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

