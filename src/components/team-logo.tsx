"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface TeamLogoProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function TeamLogo({ src, alt, size = 32, className }: TeamLogoProps) {
  if (!src) {
    return (
      <div
        className={cn("flex items-center justify-center rounded-full bg-muted", className)}
        style={{ width: size, height: size }}
      >
        <Shield className="h-3/5 w-3/5 text-muted-foreground" />
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
