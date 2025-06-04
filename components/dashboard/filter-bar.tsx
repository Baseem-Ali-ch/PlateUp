"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { useRecipes } from "@/context/recipe-context"
import { cuisineTypes, difficultyLevels, cookingTimes, dietaryPreferences, sortOptions } from "@/utils/mock-data"
import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function FilterBar() {
  const {
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
    filteredRecipes,
  } = useRecipes()

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const activeFiltersCount = [
    cuisineFilter !== "All Cuisines",
    difficultyFilter !== "All Levels",
    timeFilter !== "Any Time",
    dietaryFilter !== "All Diets",
  ].filter(Boolean).length

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Cuisine Type</label>
        <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cuisineTypes.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Difficulty Level</label>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {difficultyLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cooking Time</label>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cookingTimes.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Dietary Preferences</label>
        <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dietaryPreferences.map((diet) => (
              <SelectItem key={diet} value={diet}>
                {diet}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search recipes, ingredients, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden relative">
                <SlidersHorizontal className="w-4 h-4" />
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Recipes</SheetTitle>
                <SheetDescription>Narrow down your recipe search with these filters.</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4">
        <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cuisineTypes.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {difficultyLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cookingTimes.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dietaryPreferences.map((diet) => (
              <SelectItem key={diet} value={diet}>
                {diet}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {cuisineFilter !== "All Cuisines" && (
            <Badge variant="secondary" className="gap-1">
              {cuisineFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setCuisineFilter("All Cuisines")} />
            </Badge>
          )}
          {difficultyFilter !== "All Levels" && (
            <Badge variant="secondary" className="gap-1">
              {difficultyFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setDifficultyFilter("All Levels")} />
            </Badge>
          )}
          {timeFilter !== "Any Time" && (
            <Badge variant="secondary" className="gap-1">
              {timeFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setTimeFilter("Any Time")} />
            </Badge>
          )}
          {dietaryFilter !== "All Diets" && (
            <Badge variant="secondary" className="gap-1">
              {dietaryFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setDietaryFilter("All Diets")} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
