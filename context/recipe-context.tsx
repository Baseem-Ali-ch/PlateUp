"use client"

import React, { useEffect } from "react"
import { createContext, useContext, useState, useMemo } from "react"
import { Recipe } from "@/utils/mock-data"

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
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [cuisineFilter, setCuisineFilter] = useState("All Cuisines")
  const [difficultyFilter, setDifficultyFilter] = useState("All Levels")
  const [timeFilter, setTimeFilter] = useState("Any Time")
  const [dietaryFilter, setDietaryFilter] = useState("All Diets")
  const [sortBy, setSortBy] = useState("latest")

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes/all')
        const data = await response.json()
        // The API returns the recipes directly, not in a recipes property
        setRecipes(data)
      } catch (error) {
        console.error('Error fetching recipes:', error)
      }
    }
    fetchRecipes()
  }, [])

  const filteredRecipes = useMemo(() => {
    let filtered = [...recipes]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Cuisine filter
    if (cuisineFilter !== "All Cuisines") {
      filtered = filtered.filter(recipe => recipe.cuisine === cuisineFilter)
    }

    // Difficulty filter
    if (difficultyFilter !== "All Levels") {
      filtered = filtered.filter(recipe => recipe.difficulty === difficultyFilter)
    }

    // Time filter
    if (timeFilter !== "Any Time") {
      // Extract just the number from the time string (e.g., "30 min" -> "30")
      const timeValue = parseInt(timeFilter.replace(/[^0-9]/g, ''))
      filtered = filtered.filter(recipe => recipe.cookingTime <= timeValue)
    }

    // Dietary filter
    if (dietaryFilter !== "All Diets") {
      filtered = filtered.filter(recipe => 
        recipe.dietaryPrefs && recipe.dietaryPrefs.includes(dietaryFilter)
      )
    }

    // Sort by
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
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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

export function useRecipeContext() {
  const context = useContext(RecipeContext)
  if (context === undefined) {
    throw new Error("useRecipeContext must be used within a RecipeProvider")
  }
  return context
}
