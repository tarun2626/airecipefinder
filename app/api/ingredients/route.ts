import { NextResponse } from 'next/server';
import { ingredientCategories } from "@/lib/data";

// Common ingredients list as fallback
const commonIngredients = [
  "chicken", "beef", "pork", "rice", "pasta", "potato", 
  "onion", "garlic", "tomato", "carrot", "broccoli",
  "cheese", "milk", "eggs", "butter", "olive oil",
  "salt", "pepper", "flour", "sugar"
];

export async function GET() {
  try {
    // Use the existing ingredient data from lib/data.ts
    const allIngredients = ingredientCategories.flatMap(category => 
      category.ingredients.map(ing => ({
        value: ing,
        label: ing
      }))
    );
    
    return NextResponse.json(allIngredients);
  } catch (error) {
    console.error('Error in ingredients API:', error);
    // Return a valid, empty array in case of error
    return NextResponse.json([]);
  }
} 