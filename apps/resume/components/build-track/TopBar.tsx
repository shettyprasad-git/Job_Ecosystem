
import { Badge } from "@/components/ui/badge";

type TopBarProps = {
  stepIndex: number;
  totalSteps: number;
  isShipped?: boolean;
};

export function TopBar({ stepIndex, totalSteps, isShipped = false }: TopBarProps) {
  const isProofPage = stepIndex >= totalSteps;
  
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6 shrink-0">
      <div className="font-headline text-lg font-medium text-foreground">
        AI Resume Builder
      </div>
      <div className="text-sm text-muted-foreground">
        {isProofPage ? "Project 3 — Final Proof" : `Project 3 — Step ${stepIndex + 1} of ${totalSteps}`}
      </div>
      <div>
        {isShipped ? (
          <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-primary-foreground">
            Shipped
          </Badge>
        ) : (
          <Badge variant={isProofPage ? "default" : "secondary"}>
            {isProofPage ? "Submission" : "In Progress"}
          </Badge>
        )}
      </div>
    </header>
  );
}
