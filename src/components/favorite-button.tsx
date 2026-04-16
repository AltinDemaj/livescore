"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "default";
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  className,
  size = "sm",
}: FavoriteButtonProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "icon" : "default"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "h-8 w-8 shrink-0",
        isFavorite && "text-yellow-500 hover:text-yellow-600",
        className,
      )}
    >
      <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
    </Button>
  );
}
