import { UserButton } from "@clerk/nextjs";
import { MobileNav } from "./MobileNav";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <header className="flex h-16 items-center justify-between gap-4 border-b px-4 sm:px-8">
        <h1 className="truncate font-heading text-xl font-semibold tracking-tight">{title}</h1>
        <UserButton />
      </header>
      <MobileNav />
    </div>
  );
}
