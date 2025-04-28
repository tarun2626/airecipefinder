"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten Free" },
  { id: "dairy-free", label: "Dairy Free" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "low-carb", label: "Low Carb" },
  { id: "low-fat", label: "Low Fat" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "nut-free", label: "Nut Free" },
]

interface DietaryPreferencesProps {
  userId: string
  currentPreferences: string[]
}

export function DietaryPreferences({ userId, currentPreferences }: DietaryPreferencesProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(currentPreferences)

  useEffect(() => {
    setSelectedPreferences(currentPreferences)
  }, [currentPreferences])

  const togglePreference = (preference: string) => {
    setSelectedPreferences((current) =>
      current.includes(preference) ? current.filter((p) => p !== preference) : [...current, preference],
    )
  }

  async function onSubmit() {
    setIsLoading(true)

    try {
      const response = await fetch("/api/profile/dietary-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          preferences: selectedPreferences,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to update preferences")
      }

      toast({
        title: "Preferences updated",
        description: "Your dietary preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dietaryOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedPreferences.includes(option.id)}
              onCheckedChange={() => togglePreference(option.id)}
            />
            <label
              htmlFor={option.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Preferences"
        )}
      </Button>
    </div>
  )
}

