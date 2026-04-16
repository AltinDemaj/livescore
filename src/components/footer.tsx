import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Zap className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">LiveScore</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/live" className="hover:text-foreground transition-colors">Live</Link>
            <Link href="/fixtures" className="hover:text-foreground transition-colors">Fixtures</Link>
            <Link href="/standings" className="hover:text-foreground transition-colors">Standings</Link>
            <Link href="/search" className="hover:text-foreground transition-colors">Search</Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LiveScore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
