import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { toggleFavoriteRecipe } from "@/lib/user"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const recipeId = params.id
    const favorited = await toggleFavoriteRecipe(session.user.id, recipeId)

    return NextResponse.json({ favorited }, { status: 200 })
  } catch (error) {
    console.error("Favorite toggle error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

