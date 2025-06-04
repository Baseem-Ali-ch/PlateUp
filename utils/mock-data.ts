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
  amount: string
  unit: string
}

export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  cookingTime: number
  prepTime: number
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  cuisine: string
  dietaryPreferences: string[]
  ingredients: Ingredient[]
  instructions: RecipeStep[]
  author: {
    id: string
    name: string
    avatar: string
    recipeCount: number
  }
  likes: number
  createdAt: Date
  tags: string[]
  nutritionalInfo?: NutritionalInfo
  isPublished: boolean
  isDraft: boolean
}

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Classic Spaghetti Carbonara",
    description:
      "Creamy Italian pasta dish with eggs, cheese, and pancetta. This authentic Roman recipe creates a silky sauce without cream, using just eggs, cheese, and pasta water.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop",
    cookingTime: 25,
    prepTime: 15,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Italian",
    dietaryPreferences: ["Vegetarian"],
    ingredients: [
      { id: "1", name: "Spaghetti", amount: "400", unit: "g" },
      { id: "2", name: "Large eggs", amount: "3", unit: "whole" },
      { id: "3", name: "Parmesan cheese", amount: "100", unit: "g" },
      { id: "4", name: "Pancetta", amount: "150", unit: "g" },
      { id: "5", name: "Black pepper", amount: "1", unit: "tsp" },
      { id: "6", name: "Salt", amount: "to taste", unit: "" },
    ],
    instructions: [
      {
        id: "1",
        instruction:
          "Bring a large pot of salted water to boil. Cook spaghetti according to package directions until al dente.",
        duration: 10,
      },
      {
        id: "2",
        instruction:
          "While pasta cooks, cut pancetta into small cubes and cook in a large skillet over medium heat until crispy, about 5-7 minutes.",
        duration: 7,
      },
      {
        id: "3",
        instruction: "In a bowl, whisk together eggs, grated Parmesan, and freshly ground black pepper.",
        duration: 3,
      },
      {
        id: "4",
        instruction: "Reserve 1 cup pasta water before draining. Add hot pasta to the skillet with pancetta.",
        duration: 2,
      },
      {
        id: "5",
        instruction:
          "Remove from heat and quickly toss with egg mixture, adding pasta water gradually until creamy. Serve immediately.",
        duration: 3,
      },
    ],
    author: {
      id: "1",
      name: "Marco Rossi",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      recipeCount: 23,
    },
    likes: 234,
    createdAt: new Date("2024-01-15"),
    tags: ["pasta", "italian", "comfort-food", "authentic", "roman"],
    nutritionalInfo: {
      calories: 520,
      protein: 22,
      carbs: 65,
      fat: 18,
      fiber: 3,
      sugar: 2,
    },
    isPublished: true,
    isDraft: false,
  },
  {
    id: "2",
    title: "Asian Vegetable Stir Fry",
    description: "Quick and healthy stir-fry with fresh vegetables and soy sauce",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop",
    cookingTime: 15,
    prepTime: 5,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Asian",
    dietaryPreferences: ["Vegetarian", "Vegan", "Gluten-free"],
    ingredients: [
      { id: "7", name: "Mixed vegetables", amount: "300", unit: "g" },
      { id: "8", name: "Soy sauce", amount: "2", unit: "tbsp" },
      { id: "9", name: "Garlic", amount: "2", unit: "cloves" },
      { id: "10", name: "Ginger", amount: "1", unit: "inch" },
      { id: "11", name: "Sesame oil", amount: "1", unit: "tbsp" },
    ],
    instructions: [
      { id: "6", instruction: "Heat oil in a wok or large skillet over high heat.", duration: 2 },
      { id: "7", instruction: "Add garlic and ginger, stir-fry for 30 seconds.", duration: 1 },
      { id: "8", instruction: "Add mixed vegetables and stir-fry until tender-crisp.", duration: 7 },
      { id: "9", instruction: "Pour in soy sauce and stir to coat. Serve hot.", duration: 5 },
    ],
    author: {
      id: "2",
      name: "Lin Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      recipeCount: 15,
    },
    likes: 189,
    createdAt: new Date("2024-01-20"),
    tags: ["stir-fry", "healthy", "quick"],
    isPublished: true,
    isDraft: false,
  },
  {
    id: "3",
    title: "Gourmet Beef Burger",
    description: "Juicy beef patty with caramelized onions and special sauce",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    cookingTime: 30,
    prepTime: 10,
    servings: 1,
    difficulty: "Medium",
    cuisine: "American",
    dietaryPreferences: [],
    ingredients: [
      { id: "12", name: "Ground beef", amount: "200", unit: "g" },
      { id: "13", name: "Burger buns", amount: "1", unit: "whole" },
      { id: "14", name: "Cheese", amount: "1", unit: "slice" },
      { id: "15", name: "Lettuce", amount: "2", unit: "leaves" },
      { id: "16", name: "Tomato", amount: "1", unit: "slice" },
      { id: "17", name: "Onions", amount: "1/4", unit: "whole" },
    ],
    instructions: [
      { id: "10", instruction: "Form ground beef into patties and season with salt and pepper.", duration: 5 },
      { id: "11", instruction: "Grill burgers to desired doneness.", duration: 15 },
      { id: "12", instruction: "Toast burger buns lightly.", duration: 2 },
      { id: "13", instruction: "Assemble burger with cheese, lettuce, tomato, and onions.", duration: 8 },
    ],
    author: {
      id: "3",
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      recipeCount: 32,
    },
    likes: 156,
    createdAt: new Date("2024-01-18"),
    tags: ["burger", "grilling", "comfort-food"],
    isPublished: true,
    isDraft: false,
  },
  {
    id: "4",
    title: "Chocolate Chip Cookies",
    description: "Soft and chewy homemade cookies with chocolate chips",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop",
    cookingTime: 45,
    prepTime: 15,
    servings: 12,
    difficulty: "Easy",
    cuisine: "American",
    dietaryPreferences: ["Vegetarian"],
    ingredients: [
      { id: "18", name: "Flour", amount: "2", unit: "cups" },
      { id: "19", name: "Butter", amount: "1", unit: "cup" },
      { id: "20", name: "Sugar", amount: "3/4", unit: "cup" },
      { id: "21", name: "Eggs", amount: "2", unit: "whole" },
      { id: "22", name: "Chocolate chips", amount: "1", unit: "cup" },
      { id: "23", name: "Vanilla", amount: "1", unit: "tsp" },
    ],
    instructions: [
      { id: "14", instruction: "Mix dry ingredients in a bowl.", duration: 5 },
      { id: "15", instruction: "Cream butter and sugar until light and fluffy.", duration: 5 },
      { id: "16", instruction: "Add eggs one at a time, mixing well after each addition.", duration: 2 },
      { id: "17", instruction: "Fold in chocolate chips.", duration: 3 },
      { id: "18", instruction: "Drop by rounded tablespoons onto baking sheets and bake.", duration: 30 },
    ],
    author: {
      id: "4",
      name: "Emily Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      recipeCount: 18,
    },
    likes: 298,
    createdAt: new Date("2024-01-22"),
    tags: ["dessert", "baking", "cookies"],
    isPublished: true,
    isDraft: false,
  },
  {
    id: "5",
    title: "Chicken Tikka Masala",
    description: "Creamy and spicy Indian curry with tender chicken pieces",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop",
    cookingTime: 60,
    prepTime: 20,
    servings: 6,
    difficulty: "Hard",
    cuisine: "Indian",
    dietaryPreferences: ["Gluten-free"],
    ingredients: [
      { id: "24", name: "Chicken", amount: "500", unit: "g" },
      { id: "25", name: "Yogurt", amount: "1", unit: "cup" },
      { id: "26", name: "Tomatoes", amount: "400", unit: "g" },
      { id: "27", name: "Cream", amount: "1/2", unit: "cup" },
      { id: "28", name: "Spices", amount: "2", unit: "tbsp" },
      { id: "29", name: "Onions", amount: "1", unit: "whole" },
    ],
    instructions: [
      { id: "19", instruction: "Marinate chicken in yogurt and spices for at least 30 minutes.", duration: 30 },
      { id: "20", instruction: "Cook chicken in a pan until browned.", duration: 15 },
      { id: "21", instruction: "Make sauce with tomatoes, onions, and spices.", duration: 10 },
      { id: "22", instruction: "Combine chicken and sauce, simmer until cooked through.", duration: 5 },
    ],
    author: {
      id: "5",
      name: "Priya Patel",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      recipeCount: 27,
    },
    likes: 267,
    createdAt: new Date("2024-01-25"),
    tags: ["curry", "spicy", "indian"],
    isPublished: true,
    isDraft: false,
  },
  {
    id: "6",
    title: "Mediterranean Greek Salad",
    description: "Fresh and healthy salad with feta cheese and olives",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop",
    cookingTime: 10,
    prepTime: 5,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Mediterranean",
    dietaryPreferences: ["Vegetarian", "Gluten-free"],
    ingredients: [
      { id: "30", name: "Tomatoes", amount: "2", unit: "whole" },
      { id: "31", name: "Cucumbers", amount: "1", unit: "whole" },
      { id: "32", name: "Feta cheese", amount: "150", unit: "g" },
      { id: "33", name: "Olives", amount: "1/2", unit: "cup" },
      { id: "34", name: "Red onion", amount: "1/4", unit: "whole" },
      { id: "35", name: "Olive oil", amount: "2", unit: "tbsp" },
    ],
    instructions: [
      { id: "23", instruction: "Chop vegetables into bite-sized pieces.", duration: 3 },
      { id: "24", instruction: "Add feta cheese and olives.", duration: 1 },
      { id: "25", instruction: "Dress with olive oil and season with salt and pepper.", duration: 1 },
      { id: "26", instruction: "Serve immediately.", duration: 5 },
    ],
    author: {
      id: "6",
      name: "Maria Konstantinou",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      recipeCount: 12,
    },
    likes: 145,
    createdAt: new Date("2024-01-28"),
    tags: ["salad", "healthy", "mediterranean"],
    isPublished: true,
    isDraft: false,
  },
  {
    id: "7",
    title: "Homemade Pizza Margherita",
    description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
    cookingTime: 45,
    prepTime: 30,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Italian",
    dietaryPreferences: ["Vegetarian"],
    ingredients: [
      { id: "36", name: "Pizza dough", amount: "1", unit: "ball" },
      { id: "37", name: "Tomato sauce", amount: "1/2", unit: "cup" },
      { id: "38", name: "Fresh mozzarella", amount: "200", unit: "g" },
      { id: "39", name: "Fresh basil", amount: "10", unit: "leaves" },
      { id: "40", name: "Olive oil", amount: "2", unit: "tbsp" },
    ],
    instructions: [
      { id: "27", instruction: "Preheat oven to 475°F (245°C).", duration: 15 },
      { id: "28", instruction: "Roll out pizza dough on floured surface.", duration: 10 },
      { id: "29", instruction: "Spread tomato sauce evenly over dough.", duration: 3 },
      { id: "30", instruction: "Add torn mozzarella and drizzle with olive oil.", duration: 5 },
      {
        id: "31",
        instruction: "Bake for 12-15 minutes until crust is golden. Add fresh basil before serving.",
        duration: 15,
      },
    ],
    author: {
      id: "1",
      name: "Marco Rossi",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      recipeCount: 23,
    },
    likes: 312,
    createdAt: new Date("2024-01-30"),
    tags: ["pizza", "italian", "homemade", "classic"],
    isPublished: true,
    isDraft: false,
  },
  {
    id: "8",
    title: "Avocado Toast with Poached Egg",
    description: "Healthy breakfast with creamy avocado and perfectly poached egg",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop",
    cookingTime: 15,
    prepTime: 5,
    servings: 1,
    difficulty: "Easy",
    cuisine: "American",
    dietaryPreferences: ["Vegetarian", "Gluten-free"],
    ingredients: [
      { id: "41", name: "Sourdough bread", amount: "2", unit: "slices" },
      { id: "42", name: "Ripe avocado", amount: "1", unit: "whole" },
      { id: "43", name: "Eggs", amount: "2", unit: "whole" },
      { id: "44", name: "Lemon juice", amount: "1", unit: "tsp" },
      { id: "45", name: "Salt and pepper", amount: "to taste", unit: "" },
    ],
    instructions: [
      { id: "32", instruction: "Toast bread slices until golden brown.", duration: 3 },
      { id: "33", instruction: "Mash avocado with lemon juice, salt, and pepper.", duration: 3 },
      { id: "34", instruction: "Poach eggs in simmering water for 3-4 minutes.", duration: 5 },
      { id: "35", instruction: "Spread avocado on toast and top with poached eggs.", duration: 2 },
    ],
    author: {
      id: "4",
      name: "Emily Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      recipeCount: 18,
    },
    likes: 187,
    createdAt: new Date("2024-02-01"),
    tags: ["breakfast", "healthy", "avocado", "eggs"],
    isPublished: true,
    isDraft: false,
  },
  {
    id: "9",
    title: "Thai Green Curry",
    description: "Aromatic and spicy Thai curry with coconut milk and fresh herbs",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop",
    cookingTime: 35,
    prepTime: 15,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Asian",
    dietaryPreferences: ["Gluten-free"],
    ingredients: [
      { id: "46", name: "Green curry paste", amount: "3", unit: "tbsp" },
      { id: "47", name: "Coconut milk", amount: "400", unit: "ml" },
      { id: "48", name: "Chicken thighs", amount: "500", unit: "g" },
      { id: "49", name: "Thai basil", amount: "1/2", unit: "cup" },
      { id: "50", name: "Fish sauce", amount: "2", unit: "tbsp" },
    ],
    instructions: [
      { id: "36", instruction: "Heat curry paste in a large pan until fragrant.", duration: 3 },
      { id: "37", instruction: "Add thick coconut milk and simmer until oil separates.", duration: 5 },
      { id: "38", instruction: "Add chicken and cook until tender.", duration: 15 },
      { id: "39", instruction: "Add remaining coconut milk and seasonings.", duration: 8 },
      { id: "40", instruction: "Garnish with Thai basil and serve with rice.", duration: 2 },
    ],
    author: {
      id: "2",
      name: "Lin Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      recipeCount: 15,
    },
    likes: 223,
    createdAt: new Date("2024-02-03"),
    tags: ["thai", "curry", "spicy", "coconut"],
    isPublished: true,
    isDraft: false,
  },
  {
    id: "10",
    title: "French Croissants",
    description: "Buttery, flaky pastries perfect for breakfast or brunch",
    image: "https://images.unsplash.com/photo-1555507036-ab794f4ade2a?w=800&h=600&fit=crop",
    cookingTime: 180,
    prepTime: 60,
    servings: 8,
    difficulty: "Hard",
    cuisine: "French",
    dietaryPreferences: ["Vegetarian"],
    ingredients: [
      { id: "51", name: "Bread flour", amount: "500", unit: "g" },
      { id: "52", name: "Butter", amount: "300", unit: "g" },
      { id: "53", name: "Milk", amount: "250", unit: "ml" },
      { id: "54", name: "Yeast", amount: "7", unit: "g" },
      { id: "55", name: "Sugar", amount: "50", unit: "g" },
    ],
    instructions: [
      { id: "41", instruction: "Make dough and let rise for 1 hour.", duration: 60 },
      { id: "42", instruction: "Prepare butter block and chill.", duration: 30 },
      { id: "43", instruction: "Laminate dough with butter through multiple folds.", duration: 45 },
      { id: "44", instruction: "Shape croissants and proof for 2 hours.", duration: 120 },
      { id: "45", instruction: "Bake at 375°F until golden brown.", duration: 20 },
    ],
    author: {
      id: "7",
      name: "Pierre Dubois",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      recipeCount: 45,
    },
    likes: 456,
    createdAt: new Date("2024-02-05"),
    tags: ["french", "pastry", "breakfast", "advanced"],
    isPublished: true,
    isDraft: false,
  },
]

export const cuisineTypes = [
  "All Cuisines",
  "Italian",
  "Asian",
  "American",
  "Indian",
  "Mediterranean",
  "Mexican",
  "French",
]

export const difficultyLevels = ["All Levels", "Easy", "Medium", "Hard"]

export const cookingTimes = ["Any Time", "Under 30 min", "30-60 min", "1+ hour"]

export const dietaryPreferences = ["All Diets", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free"]

export const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "time", label: "Cooking Time" },
  { value: "difficulty", label: "Difficulty" },
]
