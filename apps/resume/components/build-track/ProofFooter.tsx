import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

type ProofFooterProps = {
  onPrev: () => void;
  onNext: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  isLastStep: boolean;
  allStepsCompleted: boolean;
};

export function ProofFooter({
  onPrev,
  onNext,
  isPrevDisabled,
  isNextDisabled,
  isLastStep,
  allStepsCompleted,
}: ProofFooterProps) {
  return (
    <footer className="flex h-20 items-center justify-between border-t bg-card px-6 shrink-0">
      <Button variant="outline" onClick={onPrev} disabled={isPrevDisabled}>
        <ArrowLeft /> Previous
      </Button>

      {allStepsCompleted ? (
         <Button asChild variant="default" size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/rb/proof"><CheckCircle /> Go to Final Proof</Link>
        </Button>
      ) : (
        <Button onClick={onNext} disabled={isNextDisabled}>
         {isLastStep ? "Finish & Go to Proof" : "Next Step"} <ArrowRight />
      </Button>
      )}
    </footer>
  );
}
