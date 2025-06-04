"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  ArrowLeft,
  Plus,
  Grid3X3,
  List,
  Clock,
  Heart,
  ChefHat,
} from "lucide-react"
import type { Recipe } from "@/utils/mock-data"
import { mockRecipes } from "@/utils/mock-data"
import { toast } from "@/hooks/use-toast"

interface MyRecipesProps {
  onBack: () => void
  onCreateRecipe: () => void
  onEditRecipe: (recipe: Recipe) => void
  onRecipeClick: (recipe: Recipe) => void
}

export function MyRecipes({ onBack, onCreateRecipe, onEditRecipe, onRecipeClick }: MyRecipesProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("latest")
  const [activeTab, setActiveTab] = useState("published")
  const [deleteRecipeId, setDeleteRecipeId] = useState<string | null>(null)

  // Mock user recipes (in a real app, this would be fetched from API)
  const userRecipes = mockRecipes.filter((recipe) => recipe.author.id === "1") // Current user
  const draftRecipes = userRecipes.filter((recipe) => recipe.isDraft)
  const publishedRecipes = userRecipes.filter((recipe) => recipe.isPublished)

  const filteredRecipes = (recipes: Recipe[]) => {
    let filtered = recipes

    if (searchTerm) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

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
  }

  const handleDeleteRecipe = (recipeId: string) => {
    // In a real app, this would call an API to delete the recipe
    console.log("Deleting recipe:", recipeId)
    setDeleteRecipeId(null)
    toast({
      title: "Recipe deleted",
      description: "Your recipe has been permanently deleted.",
    })
  }

  const handleDuplicateRecipe = (recipe: Recipe) => {
    // In a real app, this would create a copy of the recipe
    console.log("Duplicating recipe:", recipe.id)
    toast({
      title: "Recipe duplicated",
      description: "A copy of your recipe has been created as a draft.",
    })
  }

  const handleToggleVisibility = (recipe: Recipe) => {
    // In a real app, this would update the recipe's visibility
    console.log("Toggling visibility for recipe:", recipe.id)
    toast({
      title: recipe.isPublished ? "Recipe unpublished" : "Recipe published",
      description: recipe.isPublished ? "Your recipe is now private." : "Your recipe is now visible to everyone.",
    })
  }

  const RecipeActions = ({ recipe }: { recipe: Recipe }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onRecipeClick(recipe)}>
          <Eye className="w-4 h-4 mr-2" />
          View Recipe
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEditRecipe(recipe)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Recipe
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDuplicateRecipe(recipe)}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleToggleVisibility(recipe)}>
          {recipe.isPublished ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {recipe.isPublished ? "Unpublish" : "Publish"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setDeleteRecipeId(recipe.id)} className="text-red-600 focus:text-red-600">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Recipe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const RecipeGridItem = ({ recipe }: { recipe: Recipe }) => (
    <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.title}
          className="w-full h-48 object-cover"
          onClick={() => onRecipeClick(recipe)}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=192&width=384"
          }}
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <RecipeActions recipe={recipe} />
        </div>
        {recipe.isDraft && <Badge className="absolute top-2 left-2 bg-yellow-500">Draft</Badge>}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 mb-2">{recipe.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{recipe.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookingTime}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{recipe.likes}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {recipe.difficulty}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  const RecipeListItem = ({ recipe }: { recipe: Recipe }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={recipe.image || "/placeholder.svg"}
            alt={recipe.title}
            className="w-24 h-24 object-cover rounded-lg cursor-pointer"
            onClick={() => onRecipeClick(recipe)}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=96&width=96"
            }}
            loading="lazy"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{recipe.title}</h3>
                  {recipe.isDraft && <Badge variant="secondary">Draft</Badge>}
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{recipe.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.cookingTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{recipe.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="w-4 h-4" />
                    <span>{recipe.difficulty}</span>
                  </div>
                  <span>Created {recipe.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
              <RecipeActions recipe={recipe} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">My Recipes</h1>
            </div>

            <Button onClick={onCreateRecipe} className="gap-2 bg-gradient-to-r from-orange-500 to-teal-500">
              <Plus className="w-4 h-4" />
              Create Recipe
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Filters and Controls */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search your recipes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="time">Cooking Time</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipe Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="published">Published ({publishedRecipes.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftRecipes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="published" className="mt-6">
              {publishedRecipes.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes(publishedRecipes).map((recipe) => (
                      <RecipeGridItem key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                ) : (
                  <div>
                    {filteredRecipes(publishedRecipes).map((recipe) => (
                      <RecipeListItem key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No published recipes</h3>
                  <p className="text-gray-500 mb-4">Start sharing your favorite recipes with the community!</p>
                  <Button onClick={onCreateRecipe} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Your First Recipe
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="drafts" className="mt-6">
              {draftRecipes.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes(draftRecipes).map((recipe) => (
                      <RecipeGridItem key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                ) : (
                  <div>
                    {filteredRecipes(draftRecipes).map((recipe) => (
                      <RecipeListItem key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Edit className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No draft recipes</h3>
                  <p className="text-gray-500">Your draft recipes will appear here when you save them.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRecipeId} onOpenChange={() => setDeleteRecipeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recipe? This action cannot be undone and will permanently remove the
              recipe from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteRecipeId && handleDeleteRecipe(deleteRecipeId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Recipe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
