'use client'
import { useState, useEffect } from "react"
import { RecipeCard } from "./recipe-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookingTime: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  dietaryPreferences: string[];
  likes: number;
  isPublished: boolean;
  isDraft: boolean;
  dietaryPrefs: string[];
  tags: string[];
  status: string;
  author: {
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  ingredients: {
    id: string;
    name: string;
    amount: string;
    unit: string;
  }[];
  instructions: {
    id: string;
    step: number;
    content: string;
    duration?: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface RecipeGridProps {
  onRecipeClick?: (recipe: Recipe) => void
}

export function RecipeGrid({ onRecipeClick }: RecipeGridProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayedRecipes, setDisplayedRecipes] = useState(6)
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = async () => {
    setIsLoading(true)
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    setDisplayedRecipes((prev) => prev + 6)
    setIsLoading(false)
  }

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes/all")
        if (!response.ok) {
          throw new Error("Failed to fetch recipes")
        }
        const data = await response.json()
        setRecipes(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch recipes")
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading recipes...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
        <p className="text-gray-500">Try adjusting your search terms or filters to find more recipes.</p>
      </div>
    )
  }

  const recipesToShow = recipes.slice(0, displayedRecipes)
  const hasMore = displayedRecipes < recipes.length

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipesToShow.map((recipe, index) => (
          <div
            key={recipe.id}
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <RecipeCard recipe={recipe} onRecipeClick={onRecipeClick} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button onClick={loadMore} disabled={isLoading} variant="outline" size="lg" className="min-w-[200px]">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading more...
              </>
            ) : (
              "Load More Recipes"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
