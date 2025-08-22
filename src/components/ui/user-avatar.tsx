"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DEFAULT_IMAGES } from "@/lib/constants"
import { UserCircle } from "lucide-react"

interface UserAvatarProps {
  src?: string | null
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10", 
  lg: "h-12 w-12",
  xl: "h-16 w-16"
}

export function UserAvatar({ 
  src, 
  alt = "User avatar", 
  fallback, 
  size = "md",
  className = "" 
}: UserAvatarProps) {
  // Get initials from fallback text
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Use template image if no src provided
  const imageSrc = src || DEFAULT_IMAGES.USER_AVATAR

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage 
        src={imageSrc} 
        alt={alt}
        onError={(e) => {
          // Fallback to template if image fails to load
          const target = e.target as HTMLImageElement
          target.src = DEFAULT_IMAGES.USER_AVATAR
        }}
      />
      <AvatarFallback className="bg-muted text-muted-foreground">
        {fallback ? (
          <span className="text-xs font-medium">
            {getInitials(fallback)}
          </span>
        ) : (
          <UserCircle className="h-4 w-4" />
        )}
      </AvatarFallback>
    </Avatar>
  )
}
