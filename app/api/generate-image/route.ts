import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import OpenAI from "openai"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { recipeName, ingredients } = await request.json()

    if (!recipeName) {
      return NextResponse.json({ message: "Recipe name is required" }, { status: 400 })
    }

    // Generate a prompt for DALL-E
    const prompt = `A professional food photography style image of ${recipeName}. The dish contains ${ingredients.join(", ")}. The image should be well-lit, appetizing, and on a clean background with professional styling.`

    // Generate image with DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    })

    const imageUrl = response.data[0].url

    return NextResponse.json({ imageUrl }, { status: 200 })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json({ message: "Failed to generate image" }, { status: 500 })
  }
}

