"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Upload, X, Save, Eye, ArrowLeft, Clock, Users, ChefHat, ImageIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cuisineTypes, difficultyLevels, dietaryPreferences } from "@/utils/mock-data"
import type { Ingredient, RecipeStep } from "@/utils/mock-data"

interface RecipeFormData {
  title: string
  description: string
  image: string
  prepTime: number
  cookingTime: number
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  cuisine: string
  dietaryPreferences: string[]
  ingredients: Ingredient[]
  instructions: RecipeStep[]
  tags: string[]
}

interface RecipeFormProps {
  onBack: () => void
  onSave: (recipe: RecipeFormData, isDraft: boolean) => void
  initialData?: Partial<RecipeFormData>
}

export function RecipeForm({ onBack, onSave, initialData }: RecipeFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    description: "",
    image: "",
    prepTime: 15,
    cookingTime: 30,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Italian",
    dietaryPreferences: [],
    ingredients: [{ id: "1", name: "", amount: "", unit: "" }],
    instructions: [{ id: "1", instruction: "", duration: 0 }],
    tags: [],
    ...initialData,
  })

  const [newTag, setNewTag] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { id: 1, title: "Basic Info", icon: <ImageIcon className="w-4 h-4" /> },
    { id: 2, title: "Details", icon: <Clock className="w-4 h-4" /> },
    { id: 3, title: "Ingredients", icon: <Plus className="w-4 h-4" /> },
    { id: 4, title: "Instructions", icon: <ChefHat className="w-4 h-4" /> },
    { id: 5, title: "Tags & Preview", icon: <Eye className="w-4 h-4" /> },
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (!formData.description.trim()) newErrors.description = "Description is required"
        break
      case 2:
        if (formData.prepTime <= 0) newErrors.prepTime = "Prep time must be greater than 0"
        if (formData.cookingTime <= 0) newErrors.cookingTime = "Cooking time must be greater than 0"
        if (formData.servings <= 0) newErrors.servings = "Servings must be greater than 0"
        break
      case 3:
        const validIngredients = formData.ingredients.filter((ing) => ing.name.trim() && ing.amount.trim())
        if (validIngredients.length === 0) {
          newErrors.ingredients = "At least one ingredient is required"
        }
        break
      case 4:
        const validInstructions = formData.instructions.filter((inst) => inst.instruction.trim())
        if (validInstructions.length === 0) {
          newErrors.instructions = "At least one instruction is required"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const updateFormData = (field: keyof RecipeFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const addIngredient = () => {
    const newId = (formData.ingredients.length + 1).toString()
    updateFormData("ingredients", [...formData.ingredients, { id: newId, name: "", amount: "", unit: "" }])
  }

  const removeIngredient = (id: string) => {
    updateFormData(
      "ingredients",
      formData.ingredients.filter((ing) => ing.id !== id),
    )
  }

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    updateFormData(
      "ingredients",
      formData.ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)),
    )
  }

  const addInstruction = () => {
    const newId = (formData.instructions.length + 1).toString()
    updateFormData("instructions", [...formData.instructions, { id: newId, instruction: "", duration: 0 }])
  }

  const removeInstruction = (id: string) => {
    updateFormData(
      "instructions",
      formData.instructions.filter((inst) => inst.id !== id),
    )
  }

  const updateInstruction = (id: string, field: keyof RecipeStep, value: string | number) => {
    updateFormData(
      "instructions",
      formData.instructions.map((inst) => (inst.id === id ? { ...inst, [field]: value } : inst)),
    )
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData("tags", [...formData.tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    updateFormData(
      "tags",
      formData.tags.filter((t) => t !== tag),
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to a service like Cloudinary or AWS S3
      const imageUrl = URL.createObjectURL(file)
      updateFormData("image", imageUrl)
      toast({ title: "Image uploaded", description: "Recipe image has been uploaded successfully" })
    }
  }

  const handleSave = (isDraft: boolean) => {
    if (!isDraft && !validateStep(currentStep)) return

    // Filter out empty ingredients and instructions
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter((ing) => ing.name.trim() && ing.amount.trim()),
      instructions: formData.instructions.filter((inst) => inst.instruction.trim()),
    }

    onSave(cleanedData, isDraft)
    toast({
      title: isDraft ? "Draft saved" : "Recipe published",
      description: isDraft ? "Your recipe has been saved as a draft" : "Your recipe has been published successfully",
    })
  }

  const toggleDietaryPreference = (pref: string) => {
    const current = formData.dietaryPreferences
    if (current.includes(pref)) {
      updateFormData(
        "dietaryPreferences",
        current.filter((p) => p !== pref),
      )
    } else {
      updateFormData("dietaryPreferences", [...current, pref])
    }
  }

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
              <h1 className="text-xl font-semibold">Create Recipe</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleSave(true)} className="gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button onClick={() => handleSave(false)} className="gap-2 bg-gradient-to-r from-orange-500 to-teal-500">
                <Eye className="w-4 h-4" />
                Publish Recipe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      currentStep === step.id
                        ? "bg-orange-100 text-orange-600"
                        : currentStep > step.id
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step.icon}
                    <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${currentStep > step.id ? "bg-green-300" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <Card>
            <CardContent className="p-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
                    <p className="text-gray-600 mb-6">Let's start with the basics of your recipe</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Recipe Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => updateFormData("title", e.target.value)}
                        placeholder="Enter a catchy recipe title"
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => updateFormData("description", e.target.value)}
                        placeholder="Describe your recipe - what makes it special?"
                        rows={4}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div>
                      <Label>Recipe Image</Label>
                      <div className="mt-2">
                        {formData.image ? (
                          <div className="relative">
                            <img
                              src={formData.image || "/placeholder.svg"}
                              alt="Recipe preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => updateFormData("image", "")}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Click to upload recipe image</p>
                            <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Recipe Details</h2>
                    <p className="text-gray-600 mb-6">Add timing and difficulty information</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="prepTime">Prep Time (minutes) *</Label>
                      <Input
                        id="prepTime"
                        type="number"
                        value={formData.prepTime}
                        onChange={(e) => updateFormData("prepTime", Number.parseInt(e.target.value) || 0)}
                        min="1"
                        className={errors.prepTime ? "border-red-500" : ""}
                      />
                      {errors.prepTime && <p className="text-sm text-red-500 mt-1">{errors.prepTime}</p>}
                    </div>

                    <div>
                      <Label htmlFor="cookingTime">Cooking Time (minutes) *</Label>
                      <Input
                        id="cookingTime"
                        type="number"
                        value={formData.cookingTime}
                        onChange={(e) => updateFormData("cookingTime", Number.parseInt(e.target.value) || 0)}
                        min="1"
                        className={errors.cookingTime ? "border-red-500" : ""}
                      />
                      {errors.cookingTime && <p className="text-sm text-red-500 mt-1">{errors.cookingTime}</p>}
                    </div>

                    <div>
                      <Label htmlFor="servings">Servings *</Label>
                      <Input
                        id="servings"
                        type="number"
                        value={formData.servings}
                        onChange={(e) => updateFormData("servings", Number.parseInt(e.target.value) || 0)}
                        min="1"
                        className={errors.servings ? "border-red-500" : ""}
                      />
                      {errors.servings && <p className="text-sm text-red-500 mt-1">{errors.servings}</p>}
                    </div>

                    <div>
                      <Label>Difficulty Level</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value: any) => updateFormData("difficulty", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyLevels.slice(1).map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Cuisine Type</Label>
                      <Select value={formData.cuisine} onValueChange={(value) => updateFormData("cuisine", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisineTypes.slice(1).map((cuisine) => (
                            <SelectItem key={cuisine} value={cuisine}>
                              {cuisine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Dietary Preferences</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dietaryPreferences.slice(1).map((pref) => (
                        <Badge
                          key={pref}
                          variant={formData.dietaryPreferences.includes(pref) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleDietaryPreference(pref)}
                        >
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Ingredients */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
                    <p className="text-gray-600 mb-6">List all ingredients with quantities</p>
                  </div>

                  <div className="space-y-4">
                    {formData.ingredients.map((ingredient, index) => (
                      <div key={ingredient.id} className="flex gap-3 items-start">
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <Input
                            placeholder="Amount"
                            value={ingredient.amount}
                            onChange={(e) => updateIngredient(ingredient.id, "amount", e.target.value)}
                          />
                          <Input
                            placeholder="Unit (e.g., cups, tsp)"
                            value={ingredient.unit}
                            onChange={(e) => updateIngredient(ingredient.id, "unit", e.target.value)}
                          />
                          <Input
                            placeholder="Ingredient name"
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                          />
                        </div>
                        {formData.ingredients.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeIngredient(ingredient.id)}>
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    {errors.ingredients && <p className="text-sm text-red-500">{errors.ingredients}</p>}

                    <Button variant="outline" onClick={addIngredient} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Ingredient
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Instructions */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                    <p className="text-gray-600 mb-6">Break down your recipe into clear steps</p>
                  </div>

                  <div className="space-y-4">
                    {formData.instructions.map((instruction, index) => (
                      <div key={instruction.id} className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-3">
                            <Textarea
                              placeholder={`Step ${index + 1} instructions...`}
                              value={instruction.instruction}
                              onChange={(e) => updateInstruction(instruction.id, "instruction", e.target.value)}
                              rows={3}
                            />
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <Input
                                  type="number"
                                  placeholder="Duration (min)"
                                  value={instruction.duration || ""}
                                  onChange={(e) =>
                                    updateInstruction(instruction.id, "duration", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="w-32"
                                />
                              </div>
                              {formData.instructions.length > 1 && (
                                <Button variant="outline" size="sm" onClick={() => removeInstruction(instruction.id)}>
                                  <Minus className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        {index < formData.instructions.length - 1 && <Separator />}
                      </div>
                    ))}

                    {errors.instructions && <p className="text-sm text-red-500">{errors.instructions}</p>}

                    <Button variant="outline" onClick={addInstruction} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Step
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Tags & Preview */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Tags & Preview</h2>
                    <p className="text-gray-600 mb-6">Add tags to help others discover your recipe</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Tags</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Add a tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        />
                        <Button onClick={addTag} variant="outline">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            #{tag}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Recipe Preview */}
                    <div className="border rounded-lg p-6 bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4">Recipe Preview</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-2xl">{formData.title || "Recipe Title"}</h4>
                          <p className="text-gray-600 mt-1">{formData.description || "Recipe description"}</p>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Prep: {formData.prepTime}min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Cook: {formData.cookingTime}min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>Serves: {formData.servings}</span>
                          </div>
                          <Badge variant="outline">{formData.difficulty}</Badge>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">
                            Ingredients ({formData.ingredients.filter((i) => i.name.trim()).length})
                          </h5>
                          <ul className="text-sm space-y-1">
                            {formData.ingredients
                              .filter((i) => i.name.trim())
                              .slice(0, 3)
                              .map((ing, idx) => (
                                <li key={idx}>
                                  • {ing.amount} {ing.unit} {ing.name}
                                </li>
                              ))}
                            {formData.ingredients.filter((i) => i.name.trim()).length > 3 && (
                              <li className="text-gray-500">
                                ... and {formData.ingredients.filter((i) => i.name.trim()).length - 3} more
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep < 5 ? (
                  <Button onClick={nextStep} className="gap-2">
                    Next
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleSave(true)} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Draft
                    </Button>
                    <Button
                      onClick={() => handleSave(false)}
                      className="gap-2 bg-gradient-to-r from-orange-500 to-teal-500"
                    >
                      <Eye className="w-4 h-4" />
                      Publish Recipe
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
