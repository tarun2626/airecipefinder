export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  cookTime: number
  servings: number
  cuisine: string
  ingredients: string[]
  instructions: string[]
  matchPercentage: number
  matchedIngredients: string[]
  missingIngredients: string[]
  dietaryTags: string[]
}

