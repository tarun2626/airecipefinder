import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getUserShoppingLists(userId: string) {
  const shoppingLists = await prisma.shoppingList.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return shoppingLists
}

export async function createShoppingListFromRecipe(userId: string, recipeId: string, listName: string) {
  // Get recipe details
  const { getRecipeById } = require("./api")
  const recipe = await getRecipeById(recipeId)

  if (!recipe) {
    throw new Error("Recipe not found")
  }

  // Create shopping list
  const shoppingList = await prisma.shoppingList.create({
    data: {
      name: listName || `Ingredients for ${recipe.title}`,
      userId,
      items: {
        create: recipe.ingredients.map((ingredient: string) => ({
          name: ingredient,
          quantity: null,
          checked: false,
          recipeId,
        })),
      },
    },
    include: {
      items: true,
    },
  })

  return shoppingList
}

