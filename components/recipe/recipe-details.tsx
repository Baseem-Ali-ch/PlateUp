"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Heart,
  Share2,
  Printer,
  Clock,
  Users,
  ChefHat,
  ArrowLeft,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Check,
} from "lucide-react"
import type { Recipe } from "@/utils/mock-data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

interface RecipeDetailsProps {
  recipe: Recipe
  onBack: () => void
}

export function RecipeDetails({ recipe, onBack }: RecipeDetailsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(recipe.likes)
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Recipe removed from your favorites" : "Recipe saved to your favorites",
    })
  }

  const handleIngredientCheck = (ingredientId: string) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId)
    } else {
      newChecked.add(ingredientId)
    }
    setCheckedIngredients(newChecked)
  }

  const handleStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId)
    } else {
      newCompleted.add(stepId)
    }
    setCompletedSteps(newCompleted)
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Check out this amazing recipe: ${recipe.title}`

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url)
        toast({ title: "Link copied!", description: "Recipe link copied to clipboard" })
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "instagram":
        toast({ title: "Instagram", description: "Copy the link and share on Instagram!" })
        break
    }
  }

  const handlePrint = () => {
    window.print()
    toast({ title: "Print", description: "Opening print dialog..." })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Recipes
            </Button>

            <div className="flex items-center gap-2">

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleShare("copy")}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("facebook")}>
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("twitter")}>
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("instagram")}>
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <img
                src={recipe.image || "/placeholder.svg"}
                alt={recipe.title}
                className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=320&width=800"
                }}
                loading="lazy"
              />

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{recipe.title}</h1>

                <p className="text-lg text-gray-600 leading-relaxed">{recipe.description}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Prep:</span>
                    <span>{recipe.prepTime || 15} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Cook:</span>
                    <span>{recipe.cookingTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Serves:</span>
                    <span>{recipe.servings}</span>
                  </div>
                  <Badge className={`${getDifficultyColor(recipe.difficulty)} border`}>
                    <ChefHat className="w-3 h-3 mr-1" />
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {recipe.instructions.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          completedSteps.has(step.id) ? "bg-green-500 text-white" : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {completedSteps.has(step.id) ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-gray-900 leading-relaxed ${
                            completedSteps.has(step.id) ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {step.content}
                        </p>
                        <Checkbox
                          checked={completedSteps.has(step.id)}
                          onCheckedChange={() => handleStepComplete(step.id)}
                          className="ml-4"
                        />
                      </div>
                      {step.duration && <p className="text-sm text-gray-500">⏱️ {step.duration} minutes</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recipe by</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={recipe.author.profilePic || "/placeholder.svg"}
                      alt={recipe.author.firstName + ' ' + recipe.author.lastName}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                      }}
                    />
                    <AvatarFallback>
                      {(recipe.author.firstName || '')
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      {(recipe.author.lastName || '')
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {recipe.author.firstName} {recipe.author.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{recipe.author.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
                <p className="text-sm text-gray-600">
                  {checkedIngredients.size} of {recipe.ingredients.length} checked
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center gap-3">
                    <Checkbox
                      checked={checkedIngredients.has(ingredient.id)}
                      onCheckedChange={() => handleIngredientCheck(ingredient.id)}
                    />
                    <span
                      className={`flex-1 ${checkedIngredients.has(ingredient.id) ? "line-through text-gray-500" : ""}`}
                    >
                      <span className="font-medium">
                        {ingredient.amount} {ingredient.unit}
                      </span>{" "}
                      {ingredient.name}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Nutritional Info */}
            {recipe.nutritionalInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition (per serving)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Calories</span>
                      <span className="font-medium">{recipe.nutritionalInfo.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein</span>
                      <span className="font-medium">{recipe.nutritionalInfo.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbs</span>
                      <span className="font-medium">{recipe.nutritionalInfo.carbs}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fat</span>
                      <span className="font-medium">{recipe.nutritionalInfo.fat}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fiber</span>
                      <span className="font-medium">{recipe.nutritionalInfo.fiber}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sugar</span>
                      <span className="font-medium">{recipe.nutritionalInfo.sugar}g</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recipe Meta */}
            <Card>
              <CardContent className="pt-6 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Cuisine</span>
                  <Badge variant="outline">{recipe.cuisine}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Created</span>
                  <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                </div>
                {recipe.dietaryPrefs.length > 0 && (
                  <div>
                    <span className="block mb-2">Dietary</span>
                    <div className="flex flex-wrap gap-1">
                      {recipe.dietaryPrefs.map((pref) => (
                        <Badge key={pref} variant="secondary" className="text-xs">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
