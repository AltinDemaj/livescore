"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
  navigateOnSubmit?: boolean;
}

export function SearchBar({
  className,
  placeholder = "Search teams, leagues...",
  defaultValue = "",
  onSearch,
  navigateOnSubmit = true,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch?.(query.trim());
    if (navigateOnSubmit) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!navigateOnSubmit) onSearch?.(e.target.value);
        }}
        placeholder={placeholder}
        className="h-10 pl-9 bg-card border-border/50"
      />
    </form>
  );
}
