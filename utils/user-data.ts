export interface UserProfile {
  id: string
  username: string
  email: string
  avatar: string
  bio: string
  joinDate: Date
  location?: string
  website?: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    youtube?: string
  }
  stats: {
    totalRecipes: number
    totalLikes: number
    totalFollowers: number
    totalFollowing: number
  }
  preferences: {
    emailNotifications: boolean
    profileVisibility: "public" | "private"
    showEmail: boolean
    showLocation: boolean
  }
}

export const mockUserProfiles: UserProfile[] = [
  {
    id: "1",
    username: "Marco Rossi",
    email: "marco@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Passionate Italian chef sharing authentic family recipes passed down through generations. Love creating simple, delicious meals with fresh ingredients.",
    joinDate: new Date("2023-06-15"),
    location: "Rome, Italy",
    website: "https://marcorossi.com",
    socialLinks: {
      instagram: "@marcorossi_chef",
      twitter: "@marcorossi",
    },
    stats: {
      totalRecipes: 23,
      totalLikes: 1247,
      totalFollowers: 892,
      totalFollowing: 156,
    },
    preferences: {
      emailNotifications: true,
      profileVisibility: "public",
      showEmail: false,
      showLocation: true,
    },
  },
  {
    id: "2",
    username: "Lin Chen",
    email: "lin@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Asian cuisine enthusiast and healthy cooking advocate. Specializing in quick, nutritious meals for busy lifestyles.",
    joinDate: new Date("2023-08-22"),
    location: "San Francisco, CA",
    socialLinks: {
      instagram: "@linchen_cooks",
      youtube: "LinChenCooks",
    },
    stats: {
      totalRecipes: 15,
      totalLikes: 743,
      totalFollowers: 456,
      totalFollowing: 89,
    },
    preferences: {
      emailNotifications: true,
      profileVisibility: "public",
      showEmail: false,
      showLocation: true,
    },
  },
  {
    id: "3",
    username: "John Smith",
    email: "john@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "BBQ master and comfort food lover. Always experimenting with new flavors and techniques.",
    joinDate: new Date("2023-05-10"),
    location: "Austin, TX",
    stats: {
      totalRecipes: 32,
      totalLikes: 1856,
      totalFollowers: 1234,
      totalFollowing: 203,
    },
    preferences: {
      emailNotifications: false,
      profileVisibility: "public",
      showEmail: false,
      showLocation: true,
    },
  },
  {
    id: "4",
    username: "Emily Johnson",
    email: "emily@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Baking enthusiast and dessert creator. Sharing sweet treats and comfort food recipes that bring families together.",
    joinDate: new Date("2023-07-03"),
    location: "Portland, OR",
    socialLinks: {
      instagram: "@emily_bakes",
      youtube: "EmilysBakingCorner",
    },
    stats: {
      totalRecipes: 18,
      totalLikes: 934,
      totalFollowers: 567,
      totalFollowing: 123,
    },
    preferences: {
      emailNotifications: true,
      profileVisibility: "public",
      showEmail: false,
      showLocation: true,
    },
  },
  {
    id: "5",
    username: "Priya Patel",
    email: "priya@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    bio: "Indian cuisine specialist bringing authentic flavors and traditional cooking methods to modern kitchens.",
    joinDate: new Date("2023-04-18"),
    location: "Mumbai, India",
    socialLinks: {
      instagram: "@priya_spices",
      twitter: "@priyacooks",
    },
    stats: {
      totalRecipes: 27,
      totalLikes: 1456,
      totalFollowers: 789,
      totalFollowing: 234,
    },
    preferences: {
      emailNotifications: true,
      profileVisibility: "public",
      showEmail: false,
      showLocation: true,
    },
  },
  {
    id: "6",
    username: "Maria Konstantinou",
    email: "maria@example.com",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    bio: "Mediterranean cooking enthusiast sharing healthy, fresh recipes inspired by Greek island traditions.",
    joinDate: new Date("2023-09-12"),
    location: "Athens, Greece",
    socialLinks: {
      instagram: "@maria_mediterranean",
    },
    stats: {
      totalRecipes: 12,
      totalLikes: 623,
      totalFollowers: 345,
      totalFollowing: 67,
    },
    preferences: {
      emailNotifications: true,
      profileVisibility: "public",
      showEmail: false,
      showLocation: true,
    },
  },
  {
    id: "7",
    username: "Pierre Dubois",
    email: "pierre@example.com",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    bio: "French pastry chef and culinary instructor. Sharing the art of French baking and classic techniques.",
    joinDate: new Date("2023-03-25"),
    location: "Lyon, France",
    website: "https://pierredubois.fr",
    socialLinks: {
      instagram: "@chef_pierre",
      youtube: "PierrePastryMaster",
    },
    stats: {
      totalRecipes: 45,
      totalLikes: 2134,
      totalFollowers: 1567,
      totalFollowing: 89,
    },
    preferences: {
      emailNotifications: true,
      profileVisibility: "public",
      showEmail: false,
      showLocation: true,
    },
  },
]

export function getUserProfile(userId: string): UserProfile | undefined {
  return mockUserProfiles.find((profile) => profile.id === userId)
}

export function getCurrentUserProfile(): UserProfile {
  // In a real app, this would get the current user's profile
  return mockUserProfiles[0] // Demo user
}
