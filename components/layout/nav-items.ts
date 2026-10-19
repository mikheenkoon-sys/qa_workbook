import { BookOpen, LayoutDashboard, Target } from "lucide-react";

export const navItems = [
  { href: "/",          label: "Dashboard",      icon: LayoutDashboard },
  { href: "/knowledge", label: "Knowledge Base", icon: BookOpen        },
  { href: "/practice",  label: "Practice",       icon: Target          },
];

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
