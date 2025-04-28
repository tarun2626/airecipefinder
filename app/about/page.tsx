import Link from "next/link"
import { ChefHat, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">What Can I Cook?</h1>
          </div>
          <p className="text-muted-foreground">Find delicious recipes with ingredients you already have</p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  1
                </div>
                <h3 className="text-lg font-medium mb-2">Select Ingredients</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from the ingredients you have available in your kitchen
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  2
                </div>
                <h3 className="text-lg font-medium mb-2">Find Recipes</h3>
                <p className="text-sm text-muted-foreground">
                  Our system matches your ingredients with delicious recipes
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  3
                </div>
                <h3 className="text-lg font-medium mb-2">Start Cooking</h3>
                <p className="text-sm text-muted-foreground">
                  Follow the recipe instructions and enjoy your homemade meal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Use What Can I Cook?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary mr-2">
                  ✓
                </span>
                <span>
                  <strong>Reduce food waste</strong> by using ingredients you already have
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary mr-2">
                  ✓
                </span>
                <span>
                  <strong>Save money</strong> on groceries by making the most of your pantry
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary mr-2">
                  ✓
                </span>
                <span>
                  <strong>Discover new recipes</strong> you might not have considered
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary mr-2">
                  ✓
                </span>
                <span>
                  <strong>Save time</strong> by avoiding unnecessary trips to the grocery store
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

