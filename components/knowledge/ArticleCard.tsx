import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import type { ArticleMeta } from "@/types";

interface ArticleCardProps {
  article: ArticleMeta;
  href: string;
}

export function ArticleCard({ article, href }: ArticleCardProps) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{article.title}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">{article.description}</CardDescription>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
