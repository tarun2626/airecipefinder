"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ingredientCategories, cuisineOptions } from "@/lib/data"

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten Free" },
  { id: "dairy-free", label: "Dairy Free" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "low-carb", label: "Low Carb" },
  { id: "low-fat", label: "Low Fat" },
]

export default function IngredientSelector() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([])
  const [cuisineFilters, setCuisineFilters] = useState<string[]>([])
  const [ingredientOptions, setIngredientOptions] = useState<string[]>([])

  // Load user's dietary preferences if logged in
  useEffect(() => {
    if (session?.user) {
      // This would fetch the user's preferences from the API in a real app
      fetch("/api/profile/dietary-preferences")
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch dietary preferences');
          }
          // Get text first to check if it's empty
          return res.text().then(text => {
            return text ? JSON.parse(text) : {};
          });
        })
        .then((data) => {
          if (data.preferences) {
            setDietaryFilters(data.preferences);
          }
        })
        .catch((err) => {
          console.error("Failed to load preferences:", err);
          // Don't set any preferences if there's an error
        });
    }
  }, [session]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        // Use a fallback in case the API call fails
        const fallbackIngredients = ingredientCategories.flatMap(category => 
          category.ingredients.map(ing => ({ value: ing, label: ing }))
        );
        
        try {
          const response = await fetch('/api/ingredients');
          
          // Check if response is ok before trying to parse JSON
          if (!response.ok) {
            console.error('Failed to fetch ingredients:', await response.text());
            setIngredientOptions(fallbackIngredients);
            return;
          }
          
          // Get the response text first
          const responseText = await response.text();
          
          // Only try to parse if we have content
          if (responseText.trim()) {
            const data = JSON.parse(responseText);
            setIngredientOptions(data);
          } else {
            console.warn('Empty response from ingredients API');
            setIngredientOptions(fallbackIngredients);
          }
        } catch (error) {
          console.error('Error fetching ingredients:', error);
          setIngredientOptions(fallbackIngredients);
        }
      } catch (fallbackError) {
        console.error('Critical error in ingredient fetching:', fallbackError);
        // Last resort - empty array
        setIngredientOptions([]);
      }
    };
    
    fetchIngredients();
  }, []);

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((item) => item !== ingredient) : [...prev, ingredient],
    )
  }

  const handleDietaryFilterToggle = (filter: string) => {
    setDietaryFilters((prev) => (prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]))
  }

  const handleCuisineFilterToggle = (cuisine: string) => {
    setCuisineFilters((prev) => (prev.includes(cuisine) ? prev.filter((item) => item !== cuisine) : [...prev, cuisine]))
  }

  const handleSearch = () => {
    if (selectedIngredients.length > 0) {
      const params = new URLSearchParams()

      // Add ingredients
      selectedIngredients.forEach((ingredient) => {
        params.append("ingredients", ingredient)
      })

      // Add dietary filters
      dietaryFilters.forEach((filter) => {
        params.append("diet", filter)
      })

      // Add cuisine filters
      cuisineFilters.forEach((cuisine) => {
        params.append("cuisine", cuisine)
      })

      router.push(`/recipes?${params.toString()}`)
    }
  }

  const filteredCategories = ingredientCategories.map((category) => ({
    ...category,
    ingredients: category.ingredients.filter((ingredient) =>
      ingredient.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }))

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search ingredients..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-medium">Selected Ingredients:</h3>
        <div className="flex space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Dietary Filters
                {dietaryFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {dietaryFilters.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Dietary Preferences</SheetTitle>
                <SheetDescription>Filter recipes based on your dietary needs</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <div className="space-y-4">
                  {dietaryOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${option.id}`}
                        checked={dietaryFilters.includes(option.id)}
                        onCheckedChange={() => handleDietaryFilterToggle(option.id)}
                      />
                      <label
                        htmlFor={`filter-${option.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Cuisines
                {cuisineFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {cuisineFilters.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Cuisine Types</SheetTitle>
                <SheetDescription>Filter recipes by cuisine</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  {cuisineOptions.map((cuisine) => (
                    <div key={cuisine.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cuisine-${cuisine.id}`}
                        checked={cuisineFilters.includes(cuisine.id)}
                        onCheckedChange={() => handleCuisineFilterToggle(cuisine.id)}
                      />
                      <label
                        htmlFor={`cuisine-${cuisine.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {cuisine.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 min-h-12">
        {selectedIngredients.length === 0 ? (
          <p className="text-muted-foreground text-sm">No ingredients selected yet</p>
        ) : (
          selectedIngredients.map((ingredient) => (
            <Badge
              key={ingredient}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleIngredientToggle(ingredient)}
            >
              {ingredient}
              <span className="ml-1">×</span>
            </Badge>
          ))
        )}
      </div>

      <Tabs defaultValue="vegetables">
        <TabsList className="w-full h-auto flex flex-wrap justify-start mb-2">
          {ingredientCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {filteredCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0 border rounded-md p-4">
            <ScrollArea className="h-64">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {category.ingredients.length > 0 ? (
                  category.ingredients.map((ingredient) => (
                    <Button
                      key={ingredient}
                      variant={selectedIngredients.includes(ingredient) ? "default" : "outline"}
                      className="justify-start h-auto py-2 px-3"
                      onClick={() => handleIngredientToggle(ingredient)}
                    >
                      {ingredient}
                    </Button>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full text-center py-8">No matching ingredients found</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      <Button className="w-full" size="lg" onClick={handleSearch} disabled={selectedIngredients.length === 0}>
        Find Recipes ({selectedIngredients.length})
      </Button>
    </div>
  )
}

