"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Clock, ChefHat } from "lucide-react"
import type { Recipe } from "@/utils/mock-data"
import { useState } from "react"

interface RecipeCardProps {
  recipe: Recipe
  onRecipeClick?: (recipe: Recipe) => void
}

export function RecipeCard({ recipe, onRecipeClick }: RecipeCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(recipe.likes)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
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

  const handleCardClick = () => {
    onRecipeClick?.(recipe)
  }

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-md"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=192&width=384"
          }}
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className={`${getDifficultyColor(recipe.difficulty)} border`}>
            <ChefHat className="w-3 h-3 mr-1" />
            {recipe.difficulty}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cookingTime} min</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {recipe.dietaryPrefs?.slice(0, 2).map((pref, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {pref}
            </Badge>
          ))}
          {recipe.dietaryPrefs?.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{recipe.dietaryPrefs.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={recipe.author.profilePic || "/placeholder.svg"} alt={`${recipe.author.firstName} ${recipe.author.lastName}`} />
              <AvatarFallback className="text-xs">
                {recipe.author.firstName?.[0] || ''}{recipe.author.lastName?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">
              {recipe.author.firstName} {recipe.author.lastName}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {recipe.cuisine}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
