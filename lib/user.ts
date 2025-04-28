import { PrismaClient } from "@prisma/client"
import { prisma } from './prisma';

const prismaClient = new PrismaClient()

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      preferences: {
        select: {
          dietaryType: true,
          allergies: true,
        }
      },
      savedRecipes: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          recipeId: true,
        }
      },
      shoppingLists: {
        select: {
          id: true,
          name: true,
          items: true,
        }
      }
    }
  });

  if (!user) {
    throw new Error("User not found")
  }

  return user
}

export async function getUserFavorites(userId: string) {
  const favorites = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      favorites: true,
    },
  })

  return favorites?.favorites || []
}

export async function toggleFavoriteRecipe(userId: string, recipeId: string) {
  // Check if recipe exists in database
  let recipe = await prismaClient.recipe.findUnique({
    where: { id: recipeId },
  })

  // If recipe doesn't exist in database, create it
  if (!recipe) {
    // Fetch recipe details from API
    const recipeDetails = await getRecipeById(recipeId)

    if (!recipeDetails) {
      throw new Error("Recipe not found")
    }

    // Create recipe in database
    recipe = await prismaClient.recipe.create({
      data: {
        id: recipeId,
        title: recipeDetails.title,
        description: recipeDetails.description,
        image: recipeDetails.image,
        cookTime: recipeDetails.cookTime,
        servings: recipeDetails.servings,
        cuisine: recipeDetails.cuisine,
        ingredients: recipeDetails.ingredients,
        instructions: recipeDetails.instructions,
        dietaryTags: recipeDetails.dietaryTags,
      },
    })
  }

  // Check if recipe is already favorited
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    include: {
      favorites: {
        where: { id: recipeId },
      },
    },
  })

  if (user?.favorites.length) {
    // Remove from favorites
    await prismaClient.user.update({
      where: { id: userId },
      data: {
        favorites: {
          disconnect: { id: recipeId },
        },
      },
    })
    return false // Not favorited anymore
  } else {
    // Add to favorites
    await prismaClient.user.update({
      where: { id: userId },
      data: {
        favorites: {
          connect: { id: recipeId },
        },
      },
    })
    return true // Now favorited
  }
}

// Import from api.ts to avoid circular dependencies
async function getRecipeById(id: string) {
  const { getRecipeById } = require("./api")
  return getRecipeById(id)
}

