"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface LeagueLogoProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function LeagueLogo({ src, alt, size = 24, className }: LeagueLogoProps) {
  if (!src) {
    return (
      <div
        className={cn("flex items-center justify-center rounded bg-muted", className)}
        style={{ width: size, height: size }}
      >
        <Trophy className="h-3/5 w-3/5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("object-contain", className)}
      unoptimized
    />
  );
}
