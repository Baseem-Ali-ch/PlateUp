export interface NutritionalInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
}

export interface RecipeStep {
  id: string
  instruction: string
  image?: string
  duration?: number
}

export interface Ingredient {
  id: string
  name: string
  amount?: string
  unit?: string
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookingTime: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  dietaryPrefs: string[];
  tags: string[];
  status: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    profilePic: string | null;
    email: string;
  };
  ingredients: {
    id: string;
    recipeId: string;
    name: string;
    amount: string;
    unit: string;
    createdAt: string;
    updatedAt: string;
  }[];
  instructions: {
    id: string;
    recipeId: string;
    step: number;
    content: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export const cuisineTypes = [
  "All Cuisines",
  "African",
  "American",
  "Asian",
  "British",
  "Bengali",
  "Caribbean",
  "Chinese",
  "Eastern European",
  "French",
  "German",
  "Greek",
  'Gujarati',
  'Hyderabadi',
  "Indian",
  "Italian",
  "Japanese",
  "Korean",
  "Latin American",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nordic",
  "North Indian",
  "Southeast Asian",
  "South Indian",
  "Spanish",
  "Thai",
  "Turkish",
  "Vietnamese"
]

export const difficultyLevels = ["All Levels", "Easy", "Medium", "Hard"]

export const cookingTimes = ["Any Time", "Under 30 min", "30-60 min", "1+ hour"]

export const dietaryPreferences = [
  "All Diets",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Dairy-free",
  "Non-vegetarian"
]

export const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "time", label: "Cooking Time" },
  { value: "difficulty", label: "Difficulty" },
]
