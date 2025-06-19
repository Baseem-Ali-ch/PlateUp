import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipe, isDraft } = body;

    // Validate required fields
    if (!recipe.title || !recipe.description || !recipe.image || !recipe.ingredients.length || !recipe.instructions.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First, find or create the user
    const user = await prisma.user.findUnique({
      where: { email: recipe.email }
    });

    if (!user) {
      // Generate a username from first and last name
      const username = `${recipe.firstName.toLowerCase()}${recipe.lastName.toLowerCase()}`;
      
      const newUser = await prisma.user.create({
        data: {
          firstName: recipe.firstName,
          lastName: recipe.lastName,
          email: recipe.email,
          phone: recipe.phone,
          location: recipe.location,
          bio: recipe.bio,
          status: "ACTIVE",
          public: true,
          username
        }
      });
    }

    // Create the recipe with author relationship
    const newRecipe = await prisma.recipe.create({
      data: {
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        prepTime: recipe.prepTime,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        cuisine: recipe.cuisine,
        dietaryPrefs: recipe.dietaryPreferences,
        tags: recipe.tags,
        status: isDraft ? "DRAFT" : "PUBLISHED",
        ingredients: {
          create: recipe.ingredients.map(ing => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
          })),
        },
        instructions: {
          create: recipe.instructions.map((inst, index) => ({
            step: index + 1,
            content: inst.instruction,
            duration: inst.duration,
          })),
        },
        author: {
          connect: { email: recipe.email }
        },
      },
      include: {
        ingredients: true,
        instructions: true,
      },
    });

    return NextResponse.json(
      { recipe: newRecipe },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving recipe:", error);
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
