import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { CFProgressBar } from "./CFProgressBar";
import type { RecommendationResult } from "../types";
import { cn } from "./ui/utils";

export function ResultCard({
  rank,
  result,
}: {
  rank: number;
  result: RecommendationResult;
}) {
  const top = rank === 1;
  return (
    <Card className={cn(top ? "border-sw-ai/50 shadow-sm" : "")}>
      <CardContent className="space-y-3 p-3 xs:p-4 sm:p-5 lg:p-6">
        <div className="flex items-start gap-2 xs:gap-3">
          <div
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-lg font-semibold xs:size-8 sm:size-9",
              top
                ? "bg-sw-ai text-white"
                : "bg-sw-ai/10 text-sw-ai",
            )}
          >
            {rank}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
              <Badge variant="outline" className="text-xs">
                {result.recommendation_code}
              </Badge>
              {top ? (
                <Badge className="gap-1 border-transparent bg-sw-success/15 text-sw-success hover:bg-sw-success/15">
                  <Lightbulb className="size-3" />
                  <span className="hidden xs:inline">Paling Disarankan</span>
                  <span className="xs:hidden">Terbaik</span>
                </Badge>
              ) : null}
            </div>
            <p className="mt-1 text-sm font-medium leading-snug xs:text-base">{result.recommendation}</p>
          </div>
        </div>

        <CFProgressBar percentage={result.percentage} tone={top ? "ai" : "primary"} />

        <div className="rounded-lg bg-muted/60 p-2.5 text-xs text-muted-foreground xs:p-3 xs:text-sm">
          <span className="font-medium text-foreground">Alasan: </span>
          {result.reason}
        </div>
      </CardContent>
    </Card>
  );
}
