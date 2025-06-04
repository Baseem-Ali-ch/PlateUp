"use client"

import type React from "react"
import { createContext, useContext, useState, useMemo } from "react"
import { mockRecipes, type Recipe } from "@/utils/mock-data"

interface RecipeContextType {
  recipes: Recipe[]
  filteredRecipes: Recipe[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  cuisineFilter: string
  setCuisineFilter: (cuisine: string) => void
  difficultyFilter: string
  setDifficultyFilter: (difficulty: string) => void
  timeFilter: string
  setTimeFilter: (time: string) => void
  dietaryFilter: string
  setDietaryFilter: (dietary: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  clearFilters: () => void
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined)

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes] = useState<Recipe[]>(mockRecipes)
  const [searchTerm, setSearchTerm] = useState("")
  const [cuisineFilter, setCuisineFilter] = useState("All Cuisines")
  const [difficultyFilter, setDifficultyFilter] = useState("All Levels")
  const [timeFilter, setTimeFilter] = useState("Any Time")
  const [dietaryFilter, setDietaryFilter] = useState("All Diets")
  const [sortBy, setSortBy] = useState("latest")

  const filteredRecipes = useMemo(() => {
    let filtered = [...recipes]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchTerm.toLowerCase())) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Cuisine filter
    if (cuisineFilter !== "All Cuisines") {
      filtered = filtered.filter((recipe) => recipe.cuisine === cuisineFilter)
    }

    // Difficulty filter
    if (difficultyFilter !== "All Levels") {
      filtered = filtered.filter((recipe) => recipe.difficulty === difficultyFilter)
    }

    // Time filter
    if (timeFilter !== "Any Time") {
      filtered = filtered.filter((recipe) => {
        switch (timeFilter) {
          case "Under 30 min":
            return recipe.cookingTime < 30
          case "30-60 min":
            return recipe.cookingTime >= 30 && recipe.cookingTime <= 60
          case "1+ hour":
            return recipe.cookingTime > 60
          default:
            return true
        }
      })
    }

    // Dietary filter
    if (dietaryFilter !== "All Diets") {
      filtered = filtered.filter((recipe) => recipe.dietaryPreferences.includes(dietaryFilter))
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case "time":
        filtered.sort((a, b) => a.cookingTime - b.cookingTime)
        break
      case "difficulty":
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 }
        filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
        break
      case "latest":
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    return filtered
  }, [recipes, searchTerm, cuisineFilter, difficultyFilter, timeFilter, dietaryFilter, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setCuisineFilter("All Cuisines")
    setDifficultyFilter("All Levels")
    setTimeFilter("Any Time")
    setDietaryFilter("All Diets")
    setSortBy("latest")
  }

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        filteredRecipes,
        searchTerm,
        setSearchTerm,
        cuisineFilter,
        setCuisineFilter,
        difficultyFilter,
        setDifficultyFilter,
        timeFilter,
        setTimeFilter,
        dietaryFilter,
        setDietaryFilter,
        sortBy,
        setSortBy,
        clearFilters,
      }}
    >
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipes() {
  const context = useContext(RecipeContext)
  if (context === undefined) {
    throw new Error("useRecipes must be used within a RecipeProvider")
  }
  return context
}
