import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { RecipeProvider } from "@/context/recipe-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PlateUp - Discover Recipes",
  description: "A modern platform for discovering and sharing delicious recipes with a community of food lovers.",
  icons: {
    icon: '/favicon.png',
  }}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RecipeProvider>
            {children}
            <Toaster />
          </RecipeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
