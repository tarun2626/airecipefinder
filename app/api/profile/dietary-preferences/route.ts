import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

const preferencesSchema = z.object({
  preferences: z.array(z.string()),
})

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = preferencesSchema.parse(body)

    // Update user dietary preferences
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        dietaryPreferences: validatedData.preferences,
      },
    })

    return NextResponse.json({ message: "Dietary preferences updated successfully" }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid data", errors: error.errors }, { status: 400 })
    }

    console.error("Preferences update error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // If no session, return empty preferences
    if (!session?.user) {
      return NextResponse.json({ preferences: [] });
    }
    
    // In a real app, you would fetch this from a database
    // For now, return some default preferences
    return NextResponse.json({
      preferences: ["vegetarian"] // Example default preference
    });
  } catch (error) {
    console.error('Error fetching dietary preferences:', error);
    return NextResponse.json({ preferences: [] });
  }
}

