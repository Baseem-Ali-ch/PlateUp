"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Settings,
  Heart,
  ChefHat,
  Users,
  UserPlus,
  ArrowLeft,
  Edit,
} from "lucide-react"
import type { UserProfile } from "@/utils/user-data"
import type { Recipe } from "@/utils/mock-data"
import { RecipeCard } from "@/components/dashboard/recipe-card"
import { mockRecipes } from "@/utils/mock-data"

interface ProfilePageProps {
  profile: UserProfile
  isOwnProfile?: boolean
  onBack: () => void
  onEditProfile?: () => void
  onRecipeClick?: (recipe: Recipe) => void
  onSettingsClick?: () => void
}

export function ProfilePage({
  profile,
  isOwnProfile = false,
  onBack,
  onEditProfile,
  onRecipeClick,
  onSettingsClick,
}: ProfilePageProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("recipes")

  // Get user's recipes (in a real app, this would be fetched from API)
  const userRecipes = mockRecipes.filter((recipe) => recipe.author.id === profile.id)
  const likedRecipes = mockRecipes.slice(0, 3) // Mock liked recipes

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4" />
      case "twitter":
        return <Twitter className="w-4 h-4" />
      case "youtube":
        return <Youtube className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {isOwnProfile && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onEditProfile} className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={onSettingsClick} className="gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage
                      src={profile.avatar || "/placeholder.svg"}
                      alt={profile.username}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                      }}
                    />
                    <AvatarFallback className="text-2xl">
                      {profile.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {!isOwnProfile && (
                    <Button
                      onClick={handleFollow}
                      variant={isFollowing ? "outline" : "default"}
                      className={`w-full md:w-auto gap-2 ${
                        isFollowing ? "" : "bg-gradient-to-r from-orange-500 to-teal-500"
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.username}</h1>
                    <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold">{profile.stats.totalRecipes}</span>
                      <span className="text-gray-600">recipes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="font-semibold">{profile.stats.totalLikes}</span>
                      <span className="text-gray-600">likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold">{profile.stats.totalFollowers}</span>
                      <span className="text-gray-600">followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">{profile.stats.totalFollowing}</span>
                      <span className="text-gray-600">following</span>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(profile.joinDate)}</span>
                    </div>
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(profile.website || profile.socialLinks) && (
                    <div className="flex flex-wrap gap-3">
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          <span className="text-sm">Website</span>
                        </a>
                      )}
                      {profile.socialLinks &&
                        Object.entries(profile.socialLinks).map(([platform, handle]) => (
                          <a
                            key={platform}
                            href={`https://${platform}.com/${handle.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {getSocialIcon(platform)}
                            <span className="text-sm">{handle}</span>
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recipes">Recipes ({userRecipes.length})</TabsTrigger>
              <TabsTrigger value="liked">Liked ({likedRecipes.length})</TabsTrigger>
              <TabsTrigger value="collections">Collections (0)</TabsTrigger>
            </TabsList>

            <TabsContent value="recipes" className="mt-6">
              {userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onRecipeClick={onRecipeClick} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
                  <p className="text-gray-500">
                    {isOwnProfile ? "Start sharing your favorite recipes!" : "This user hasn't shared any recipes yet."}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="liked" className="mt-6">
              {likedRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onRecipeClick={onRecipeClick} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No liked recipes</h3>
                  <p className="text-gray-500">
                    {isOwnProfile
                      ? "Start liking recipes to see them here!"
                      : "This user hasn't liked any recipes yet."}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="collections" className="mt-6">
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
                <p className="text-gray-500">
                  {isOwnProfile
                    ? "Create collections to organize your favorite recipes!"
                    : "This user hasn't created any collections yet."}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
