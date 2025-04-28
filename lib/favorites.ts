import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function isRecipeFavorited(userId: string, recipeId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      favorites: {
        where: { id: recipeId },
      },
    },
  })

  return user?.favorites.length ? true : false
}

export async function getUserFavoriteRecipes(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      favorites: true,
    },
  })

  return user?.favorites || []
}

