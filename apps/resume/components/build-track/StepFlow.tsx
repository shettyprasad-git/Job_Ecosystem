
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBuildTrack } from "./BuildTrackProvider";
import { STEPS, STEP_CONTENT } from "@/lib/build-track-data";
import { TopBar } from "./TopBar";
import { BuildPanel } from "./BuildPanel";
import { ProofFooter } from "./ProofFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function StepFlow({ stepId }: { stepId: string }) {
  const router = useRouter();
  const { state, currentStep, currentStepIndex, navigateToNextStep, navigateToPrevStep, isProofComplete } = useBuildTrack();
  
  const stepData = STEPS.find(s => s.id === stepId);
  const stepContent = STEP_CONTENT[stepId];
  const stepState = state.steps.find(s => s.id === stepId);

  useEffect(() => {
    if (!stepData || !stepState) {
        // invalid stepId in URL, redirect to current step
        if (currentStep) router.replace(`/rb/${currentStep.id}`);
        return;
    }
    if (stepState.status === 'locked') {
      // tried to access a future step, redirect to current step
      router.replace(`/rb/${currentStep?.id}`);
    }
  }, [stepId, stepData, stepState, currentStep, router]);

  if (!stepData || !stepContent || !stepState || stepState.status === 'locked') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="w-full max-w-6xl space-y-4 p-4">
          <Skeleton className="h-16 w-full" />
          <div className="flex gap-6 flex-1 h-[calc(100vh-200px)]">
              <div className="w-[70%] space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-full w-full" />
              </div>
              <div className="w-[30%] space-y-4">
                 <Skeleton className="h-full w-full" />
              </div>
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  const isNextDisabled = stepState.status !== 'completed';
  const isLastStep = currentStepIndex === STEPS.length - 1;
  const allStepsCompleted = state.steps.every(s => s.status === 'completed');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar stepIndex={currentStepIndex} totalSteps={STEPS.length} isShipped={isProofComplete} />
      <div className="flex flex-1 overflow-hidden">
        <main className="w-[70%] p-8 overflow-y-auto">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle className="font-headline text-4xl">{stepContent.title}</CardTitle>
              <CardDescription className="text-lg">{stepContent.description}</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Main workspace for future content */}
            </CardContent>
          </Card>
        </main>
        <aside className="w-[30%] border-l bg-card overflow-y-auto">
          <BuildPanel stepId={stepId} lovablePrompt={stepContent.lovablePrompt} />
        </aside>
      </div>
      <ProofFooter 
        onPrev={navigateToPrevStep}
        onNext={navigateToNextStep}
        isPrevDisabled={currentStepIndex === 0}
        isNextDisabled={isNextDisabled}
        isLastStep={isLastStep}
        allStepsCompleted={allStepsCompleted}
      />
    </div>
  );
}
