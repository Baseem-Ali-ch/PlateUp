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
import { Plus, Minus, Upload, X, Save, Eye, ArrowLeft, Clock, Users, ChefHat, ImageIcon, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cuisineTypes, difficultyLevels, dietaryPreferences } from "@/utils/mock-data"
import type { Ingredient, RecipeStep } from "@/utils/mock-data"
import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary-core";

// Initialize Cloudinary
const cloudinaryCore = cloudinary.Cloudinary.new({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

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
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  bio: string
}

interface RecipeFormProps {
  onBack: () => void
}

export function RecipeForm({ onBack }: RecipeFormProps) {
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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })

  const [newTag, setNewTag] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { id: 1, title: "User", icon: <User className="w-4 h-4" /> },
    { id: 2, title: "Basic", icon: <ImageIcon className="w-4 h-4" /> },
    { id: 3, title: "Details", icon: <Clock className="w-4 h-4" /> },
    { id: 4, title: "Ingredients", icon: <Plus className="w-4 h-4" /> },
    { id: 5, title: "Instructions", icon: <ChefHat className="w-4 h-4" /> },
    { id: 6, title: "Preview", icon: <Eye className="w-4 h-4" /> },
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address"
        }
        if (formData.phone && !/^[+]?[0-9]{10,}$/.test(formData.phone)) {
          newErrors.phone = "Please enter a valid phone number"
        }
        break

      case 2:
        if (!formData.title.trim()) newErrors.title = "Recipe title is required"
        if (!formData.description.trim()) newErrors.description = "Recipe description is required"
        if (!formData.image) newErrors.image = "Please upload a recipe image"
        break

      case 3:
        if (formData.prepTime <= 0) newErrors.prepTime = "Preparation time must be greater than 0 minutes"
        if (formData.cookingTime <= 0) newErrors.cookingTime = "Cooking time must be greater than 0 minutes"
        if (formData.servings <= 0) newErrors.servings = "Number of servings must be greater than 0"
        if (!formData.difficulty) newErrors.difficulty = "Please select a difficulty level"
        if (!formData.cuisine) newErrors.cuisine = "Please select a cuisine type"
        break

      case 4:
        const validIngredients = formData.ingredients.filter((ing) => ing.name.trim() && ing.amount.trim())
        if (validIngredients.length === 0) {
          newErrors.ingredients = "At least one ingredient is required"
        } else {
          const ingredientErrors = formData.ingredients.reduce((acc, ing) => {
            if (!ing.name.trim()) acc[ing.id] = "Ingredient name is required"
            return acc
          }, {} as Record<string, string>)
          if (Object.keys(ingredientErrors).length > 0) {
            newErrors.ingredients = "Please fill in all ingredient details"
          }
        }
        break

      case 5:
        const validInstructions = formData.instructions.filter((inst) => inst.instruction.trim())
        if (validInstructions.length === 0) {
          newErrors.instructions = "At least one instruction is required"
        } else {
          const instructionErrors = formData.instructions.reduce((acc, inst) => {
            if (!inst.instruction.trim()) acc[inst.id] = "Instruction is required"
            return acc
          }, {} as Record<string, string>)
          if (Object.keys(instructionErrors).length > 0) {
            newErrors.instructions = "Please fill in all instruction steps"
          }
        }
        break

      case 6:
        if (formData.tags.length < 1) {
          newErrors.tags = "Please add at least one tag"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6))
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      updateFormData("image", previewUrl);

      // Generate a unique filename
      const fileName = `${uuidv4()}-${file.name}`;

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "PlateUp");
      formData.append("public_id", fileName);
      formData.append("upload_preset", "default_preset"); // Using default preset
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image to Cloudinary");
      }

      const result = await response.json();
      const imageUrl = result.secure_url;
      updateFormData("image", imageUrl);

      // Clean up the preview URL
      URL.revokeObjectURL(previewUrl);

      toast({
        title: "Image uploaded",
        description: "Recipe image has been uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (isDraft: boolean) => {
    setIsLoading(true);
    try {
      if (!isDraft && !validateStep(currentStep)) return;

      // Filter out empty ingredients and instructions
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter((ing) => ing.name.trim() && ing.amount.trim()),
        instructions: formData.instructions.filter((inst) => inst.instruction.trim()),
      };

      // If this is a draft, just save locally
      if (isDraft) {
        const response = await fetch("/api/recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipe: cleanedData,
            isDraft,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save recipe");
        }

        const data = await response.json();
        console.log("Recipe saved:", data.recipe);

        // Reset form after successful save
        setFormData({
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
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          location: "",
          bio: "",
        });
        setCurrentStep(1);
        setNewTag("");
        setErrors({});

        toast({
          title: "Recipe saved",
          description: "Your recipe has been saved successfully",
        });
        return;
      }

      // For publishing, validate all required fields
      if (!cleanedData.title.trim()) throw new Error("Title is required");
      if (!cleanedData.description.trim()) throw new Error("Description is required");
      if (!cleanedData.image) throw new Error("Image is required");
      if (cleanedData.ingredients.length < 1) throw new Error("At least one ingredient is required");
      if (cleanedData.instructions.length < 1) throw new Error("At least one instruction is required");
      if (cleanedData.tags.length < 1) throw new Error("At least one tag is required");

      // Save to database
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipe: cleanedData,
          isDraft,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save recipe");
      }

      const data = await response.json();
      console.log("Recipe saved:", data.recipe);

      // Reset form after successful publish
      setFormData({
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
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
      });
      setCurrentStep(1);
      setNewTag("");
      setErrors({});

      toast({
        title: "Recipe published",
        description: "Your recipe has been published successfully",
      });
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save recipe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              {/* <Button variant="outline" onClick={() => handleSave(true)} className="gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </Button> */}
              {/* <Button
                onClick={() => handleSave(false)}
                className="gap-2 bg-gradient-to-r from-orange-500 to-teal-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Publishing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Publish Recipe
                  </div>
                )}
              </Button> */}
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${currentStep === step.id
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
              {/* Step 1: User Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Your Information</h2>
                    <p className="text-gray-600 mb-6">Let's get to know you better</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateFormData("firstName", e.target.value)}
                          placeholder="Enter your first name"
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                      </div>

                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateFormData("lastName", e.target.value)}
                          placeholder="Enter your last name"
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        placeholder="your.email@example.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        placeholder="Optional - +1 (555) 123-4567"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => updateFormData("location", e.target.value)}
                        placeholder="City, State/Country"
                        className={errors.location ? "border-red-500" : ""}
                      />
                      {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio (Optional)</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => updateFormData("bio", e.target.value)}
                        placeholder="Tell us a bit about yourself..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Basic Recipe Info */}
              {currentStep === 2 && (
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

              {/* Step 3: Recipe Details */}
              {currentStep === 3 && (
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

              {/* Step 4: Ingredients */}
              {currentStep === 4 && (
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

              {/* Step 5: Instructions */}
              {currentStep === 5 && (
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
                              <div className="flex items-center gap-1">
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

              {/* Step 6: Tags & Preview */}
              {currentStep === 6 && (
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
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-2xl">{formData.title || "Recipe Title"}</h4>
                            <Badge variant="outline" className="text-xs">
                              by {formData.firstName} {formData.lastName}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mt-1">{formData.description || "Recipe description"}</p>
                          {formData.location && (
                            <p className="text-sm text-gray-500 mt-1"> {formData.location}</p>
                          )}
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

                {currentStep < 6 ? (
                  <Button onClick={nextStep} className="gap-2">
                    Next
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    {/* <Button variant="outline" onClick={() => handleSave(true)} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Draft
                    </Button> */}
                    <Button
                      onClick={() => handleSave(false)}
                      className="gap-2 bg-gradient-to-r from-orange-500 to-teal-500"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Publishing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Publish Recipe
                        </div>
                      )}
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
