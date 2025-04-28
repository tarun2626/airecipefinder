import type { Recipe } from "./types"

// Spoonacular API integration
const SPOONACULAR_API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || process.env.SPOONACULAR_API_KEY
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com"

// Add a check to warn if API key is missing
if (!SPOONACULAR_API_KEY) {
  console.warn("Spoonacular API key is missing. Set NEXT_PUBLIC_SPOONACULAR_API_KEY in your .env.local file.");
}

// Helper function to handle API errors
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "API request failed";
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch (e) {
      // If parsing fails, use the raw error text
      errorMessage = errorText || errorMessage;
    }
    
    console.error("API Error:", errorMessage);
    throw new Error(errorMessage);
  }
  return response.json();
}

// Find recipes by ingredients
export async function findRecipesByIngredients(
  ingredients: string[],
  dietaryPreferences: string[] = [],
  cuisines: string[] = [],
): Promise<Recipe[]> {
  // Check if we're in development and API key is missing
  if (process.env.NODE_ENV === "development" && !SPOONACULAR_API_KEY) {
    console.warn("Using mock data in development mode. Add your API key to use real data.");
    return getMockRecipes(ingredients);
  }
  
  try {
    // First, search for recipes by ingredients
    const ingredientParams = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY as string,
      ingredients: ingredients.join(","),
      number: "20", // Request more recipes to filter later
      ranking: "2", // Maximize used ingredients
      ignorePantry: "true", // Ignore common pantry items
    })

    const ingredientResponse = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/findByIngredients?${ingredientParams.toString()}`,
    )

    const ingredientData = await handleApiResponse(ingredientResponse)

    if (ingredientData.length === 0) {
      return []
    }

    // Get recipe IDs from the ingredient search
    const recipeIds = ingredientData.map((item: any) => item.id).join(",")

    // Then, get bulk recipe information with filters
    const recipeParams = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY as string,
      ids: recipeIds,
      includeNutrition: "false",
    })

    // Add dietary preferences if any
    if (dietaryPreferences.length > 0) {
      dietaryPreferences.forEach((pref) => {
        recipeParams.append("diet", pref)
      })
    }

    // Add cuisine filters if any
    if (cuisines.length > 0) {
      cuisines.forEach((cuisine) => {
        recipeParams.append("cuisine", cuisine)
      })
    }

    const recipeResponse = await fetch(`${SPOONACULAR_BASE_URL}/recipes/informationBulk?${recipeParams.toString()}`)

    const recipeData = await handleApiResponse(recipeResponse)

    // Match the detailed recipe data with the ingredient matching data
    return recipeData.map((recipe: any) => {
      const ingredientMatch = ingredientData.find((item: any) => item.id === recipe.id)

      return {
        id: recipe.id.toString(),
        title: recipe.title,
        description: stripHtml(recipe.summary),
        image: recipe.image,
        cookTime: recipe.readyInMinutes || 30,
        servings: recipe.servings || 4,
        cuisine: recipe.cuisines?.length > 0 ? recipe.cuisines[0] : "Various",
        ingredients: recipe.extendedIngredients.map((ing: any) => ing.original),
        instructions: recipe.analyzedInstructions?.[0]?.steps.map((step: any) => step.step) || [],
        matchPercentage: Math.round(
          (ingredientMatch.usedIngredientCount /
            (ingredientMatch.usedIngredientCount + ingredientMatch.missedIngredientCount)) *
            100,
        ),
        matchedIngredients: ingredientMatch.usedIngredients.map((ing: any) => ing.name),
        missingIngredients: ingredientMatch.missedIngredients.map((ing: any) => ing.name),
        dietaryTags: getDietaryTags(recipe),
      }
    })
  } catch (error) {
    console.error("Error fetching recipes:", error);
    
    // Return mock data in development, empty array in production
    if (process.env.NODE_ENV === "development") {
      return getMockRecipes(ingredients);
    }
    return [];
  }
}

// Get recipe by ID
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`)

    const data = await handleApiResponse(response)

    return {
      id: data.id.toString(),
      title: data.title,
      description: stripHtml(data.summary),
      image: data.image,
      cookTime: data.readyInMinutes || 30,
      servings: data.servings || 4,
      cuisine: data.cuisines?.length > 0 ? data.cuisines[0] : "Various",
      ingredients: data.extendedIngredients.map((ing: any) => ing.original),
      instructions: data.analyzedInstructions?.[0]?.steps.map((step: any) => step.step) || [],
      matchPercentage: 100, // Not applicable for direct recipe lookup
      matchedIngredients: [],
      missingIngredients: [],
      dietaryTags: getDietaryTags(data),
    }
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return null
  }
}

// Helper function to strip HTML tags
function stripHtml(html: string): string {
  return html?.replace(/<[^>]*>?/gm, "") || ""
}

// Helper function to extract dietary tags
function getDietaryTags(recipe: any): string[] {
  const tags: string[] = []

  if (recipe.vegetarian) tags.push("vegetarian")
  if (recipe.vegan) tags.push("vegan")
  if (recipe.glutenFree) tags.push("gluten-free")
  if (recipe.dairyFree) tags.push("dairy-free")
  if (recipe.veryHealthy) tags.push("healthy")
  if (recipe.lowFodmap) tags.push("low-fodmap")

  return tags
}

// Add this helper function to generate mock recipes
function getMockRecipes(ingredients: string[]): Recipe[] {
  return [
    {
      id: "123456",
      title: "Pasta with Garlic and Olive Oil",
      description: "A simple and delicious pasta dish with garlic and olive oil.",
      image: "https://spoonacular.com/recipeImages/654959-556x370.jpg",
      cookTime: 20,
      servings: 2,
      cuisine: "Italian",
      ingredients: ["pasta", "garlic", "olive oil", "red pepper flakes", "parsley"],
      instructions: ["Cook pasta according to package directions.", "Sauté garlic in olive oil.", "Add red pepper flakes.", "Toss with pasta and garnish with parsley."],
      matchPercentage: 80,
      matchedIngredients: ingredients.filter(i => ["pasta", "garlic", "olive oil"].includes(i)),
      missingIngredients: ["red pepper flakes", "parsley"].filter(i => !ingredients.includes(i)),
      dietaryTags: ["vegetarian"]
    },
    {
      id: "234567",
      title: "Simple Chicken Stir-Fry",
      description: "A quick and easy chicken stir-fry with vegetables.",
      image: "https://spoonacular.com/recipeImages/661340-556x370.jpg",
      cookTime: 30,
      servings: 4,
      cuisine: "Asian",
      ingredients: ["chicken breast", "broccoli", "carrot", "soy sauce", "garlic", "ginger"],
      instructions: ["Cut chicken into strips.", "Stir-fry chicken until cooked.", "Add vegetables and stir-fry.", "Add sauce and simmer until thickened."],
      matchPercentage: 70,
      matchedIngredients: ingredients.filter(i => ["chicken breast", "broccoli", "carrot", "garlic"].includes(i)),
      missingIngredients: ["soy sauce", "ginger"].filter(i => !ingredients.includes(i)),
      dietaryTags: ["high-protein"]
    }
  ];
}

