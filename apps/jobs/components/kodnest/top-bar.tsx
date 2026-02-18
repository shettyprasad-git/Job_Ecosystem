import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="text-lg font-medium">KodNest Premium</div>
        <div className="flex w-1/3 flex-col items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Step 2 / 4</span>
          <Progress value={50} className="h-2" />
        </div>
        <div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>
        </div>
      </div>
    </header>
  );
}
