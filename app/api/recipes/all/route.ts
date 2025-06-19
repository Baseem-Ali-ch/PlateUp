import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profilePic: true,
            email: true,
            bio: true,
            phone: true,
            location: true,
          },
        },
        ingredients: true,
        instructions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
