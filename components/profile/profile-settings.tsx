"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Upload,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  Bell,
  User,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react"
import type { UserProfile } from "@/utils/user-data"
import { toast } from "@/hooks/use-toast"

interface ProfileSettingsProps {
  profile: UserProfile
  onBack: () => void
  onSave: (updatedProfile: Partial<UserProfile>) => void
}

export function ProfileSettings({ profile, onBack, onSave }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    username: profile.username,
    email: profile.email,
    bio: profile.bio,
    location: profile.location || "",
    website: profile.website || "",
    avatar: profile.avatar,
    socialLinks: {
      instagram: profile.socialLinks?.instagram || "",
      twitter: profile.socialLinks?.twitter || "",
      youtube: profile.socialLinks?.youtube || "",
    },
    preferences: { ...profile.preferences },
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateFormData = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters"
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Website must be a valid URL (include http:// or https://)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to a service like Cloudinary or AWS S3
      const imageUrl = URL.createObjectURL(file)
      updateFormData("avatar", imageUrl)
      toast({ title: "Avatar updated", description: "Your profile picture has been updated" })
    }
  }

  const handleSaveProfile = () => {
    if (validateProfileForm()) {
      onSave(formData)
      toast({ title: "Profile updated", description: "Your profile has been successfully updated" })
    }
  }

  const handleChangePassword = () => {
    if (validatePasswordForm()) {
      // In a real app, this would call an API to change the password
      console.log("Changing password...")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      toast({ title: "Password changed", description: "Your password has been successfully updated" })
    }
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    console.log("Deleting account...")
    toast({ title: "Account deleted", description: "Your account has been permanently deleted" })
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
              <h1 className="text-xl font-semibold">Profile Settings</h1>
            </div>

            <Button onClick={handleSaveProfile} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={formData.avatar || "/placeholder.svg"}
                        alt={formData.username}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=96&width=96"
                        }}
                      />
                      <AvatarFallback className="text-xl">
                        {formData.username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                        <Upload className="w-4 h-4" />
                        Change Avatar
                      </Button>
                      <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => updateFormData("username", e.target.value)}
                        className={errors.username ? "border-red-500" : ""}
                      />
                      {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => updateFormData("location", e.target.value)}
                        placeholder="City, Country"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => updateFormData("website", e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className={errors.website ? "border-red-500" : ""}
                      />
                      {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => updateFormData("bio", e.target.value)}
                      placeholder="Tell us about yourself and your cooking style..."
                      rows={4}
                      className={errors.bio ? "border-red-500" : ""}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      {errors.bio && <span className="text-red-500">{errors.bio}</span>}
                      <span className="ml-auto">{formData.bio.length}/500</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="instagram" className="flex items-center gap-2">
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </Label>
                        <Input
                          id="instagram"
                          value={formData.socialLinks.instagram}
                          onChange={(e) => updateFormData("socialLinks.instagram", e.target.value)}
                          placeholder="@username"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="flex items-center gap-2">
                          <Twitter className="w-4 h-4" />
                          Twitter
                        </Label>
                        <Input
                          id="twitter"
                          value={formData.socialLinks.twitter}
                          onChange={(e) => updateFormData("socialLinks.twitter", e.target.value)}
                          placeholder="@username"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="youtube" className="flex items-center gap-2">
                          <Youtube className="w-4 h-4" />
                          YouTube
                        </Label>
                        <Input
                          id="youtube"
                          value={formData.socialLinks.youtube}
                          onChange={(e) => updateFormData("socialLinks.youtube", e.target.value)}
                          placeholder="Channel name"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Change Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                          className={errors.currentPassword ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                        >
                          {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                          className={errors.newPassword ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                        >
                          {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          className={errors.confirmPassword ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>

                    <Button onClick={handleChangePassword} className="w-full">
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-red-600 mb-2">Delete Account</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="gap-2">
                              <Trash2 className="w-4 h-4" />
                              Delete Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Account</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you absolutely sure? This action cannot be undone. This will permanently delete your
                                account and remove all your data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                                Yes, delete my account
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Account Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Privacy Settings</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Profile Visibility</Label>
                        <p className="text-sm text-gray-600">Control who can see your profile</p>
                      </div>
                      <Select
                        value={formData.preferences.profileVisibility}
                        onValueChange={(value: any) => updateFormData("preferences.profileVisibility", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Show Email</Label>
                        <p className="text-sm text-gray-600">Display your email on your profile</p>
                      </div>
                      <Switch
                        checked={formData.preferences.showEmail}
                        onCheckedChange={(checked) => updateFormData("preferences.showEmail", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Show Location</Label>
                        <p className="text-sm text-gray-600">Display your location on your profile</p>
                      </div>
                      <Switch
                        checked={formData.preferences.showLocation}
                        onCheckedChange={(checked) => updateFormData("preferences.showLocation", checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notifications</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive email updates about your account</p>
                      </div>
                      <Switch
                        checked={formData.preferences.emailNotifications}
                        onCheckedChange={(checked) => updateFormData("preferences.emailNotifications", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
