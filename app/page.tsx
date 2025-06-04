"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { AuthForm } from "@/components/auth/auth-form"
import { Header } from "@/components/layout/header"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { RecipeGrid } from "@/components/dashboard/recipe-grid"
import { RecipeDetails } from "@/components/recipe/recipe-details"
import { RecipeForm } from "@/components/recipe/recipe-form"
import { ProfilePage } from "@/components/profile/profile-page"
import { MyRecipes } from "@/components/profile/my-recipes"
import { ProfileSettings } from "@/components/profile/profile-settings"
import { getCurrentUserProfile } from "@/utils/user-data"
import type { Recipe } from "@/utils/mock-data"

type ViewType = "dashboard" | "details" | "create" | "profile" | "my-recipes" | "settings"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [userProfile] = useState(getCurrentUserProfile())

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthForm />
  }

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setCurrentView("details")
  }

  const handleCreateRecipe = () => {
    setCurrentView("create")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedRecipe(null)
  }

  const handleSaveRecipe = (recipeData: any, isDraft: boolean) => {
    // In a real app, this would save to your backend
    console.log("Saving recipe:", recipeData, "as draft:", isDraft)
    handleBackToDashboard()
  }

  const handleProfileClick = () => {
    setCurrentView("profile")
  }

  const handleMyRecipesClick = () => {
    setCurrentView("my-recipes")
  }

  const handleSettingsClick = () => {
    setCurrentView("settings")
  }

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setCurrentView("create")
  }

  const handleSaveProfile = (updatedProfile: any) => {
    // In a real app, this would save to your backend
    console.log("Saving profile:", updatedProfile)
  }

  if (currentView === "details" && selectedRecipe) {
    return <RecipeDetails recipe={selectedRecipe} onBack={handleBackToDashboard} />
  }

  if (currentView === "create") {
    return (
      <RecipeForm
        onBack={handleBackToDashboard}
        onSave={handleSaveRecipe}
        initialData={selectedRecipe ? selectedRecipe : undefined}
      />
    )
  }

  if (currentView === "profile") {
    return (
      <ProfilePage
        profile={userProfile}
        isOwnProfile={true}
        onBack={handleBackToDashboard}
        onEditProfile={() => setCurrentView("settings")}
        onRecipeClick={handleRecipeClick}
        onSettingsClick={handleSettingsClick}
      />
    )
  }

  if (currentView === "my-recipes") {
    return (
      <MyRecipes
        onBack={handleBackToDashboard}
        onCreateRecipe={handleCreateRecipe}
        onEditRecipe={handleEditRecipe}
        onRecipeClick={handleRecipeClick}
      />
    )
  }

  if (currentView === "settings") {
    return <ProfileSettings profile={userProfile} onBack={() => setCurrentView("profile")} onSave={handleSaveProfile} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCreateRecipe={handleCreateRecipe}
        onProfileClick={handleProfileClick}
        onMyRecipesClick={handleMyRecipesClick}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Discover Amazing Recipes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore thousands of delicious recipes from our community of passionate cooks. Filter by cuisine,
              difficulty, cooking time, and dietary preferences to find your perfect dish.
            </p>
          </div>

          <FilterBar />
          <RecipeGrid onRecipeClick={handleRecipeClick} />
        </div>
      </main>
    </div>
  )
}
