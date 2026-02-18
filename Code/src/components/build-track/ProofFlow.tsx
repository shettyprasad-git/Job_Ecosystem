
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBuildTrack } from "./BuildTrackProvider";
import { TopBar } from "./TopBar";
import { STEPS } from "@/lib/build-track-data";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CheckCircle, Github, Link as LinkIcon, Clipboard, ArrowLeft, Rocket } from "lucide-react";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function ProofFlow() {
  const router = useRouter();
  const { state, setState, currentStep, isProofComplete } = useBuildTrack();
  const { toast } = useToast();

  const allStepsCompleted = state.steps.every(s => s.status === 'completed');

  useEffect(() => {
    if (!allStepsCompleted && currentStep) {
      router.replace(`/rb/${currentStep.id}`);
    }
  }, [allStepsCompleted, currentStep, router]);

  const handleCopy = () => {
    const submissionText = `
------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${state.lovableLink}
GitHub Repository: ${state.githubLink}
Live Deployment: ${state.deployLink}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------
    `;
    navigator.clipboard.writeText(submissionText.trim());
    toast({
        title: "Final Submission Copied!",
        description: "You can now paste it where it needs to go.",
    });
  };

  if (!allStepsCompleted) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar stepIndex={STEPS.length} totalSteps={STEPS.length} isShipped={isProofComplete} />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold">Project 3: Final Proof</h1>
                <p className="text-muted-foreground text-lg mt-2">Verify your completed steps and provide the final links for submission.</p>
            </div>

            {isProofComplete && (
                <Alert className="border-green-600 bg-green-500/10 text-green-700 dark:text-green-300">
                    <Rocket className="size-5" />
                    <AlertTitle className="font-bold">Project 3 Shipped Successfully.</AlertTitle>
                    <AlertDescription>
                        You have completed all steps and provided all necessary links.
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Step Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {state.steps.map(step => (
                            <li key={step.id} className="flex items-center gap-3">
                                <CheckCircle className="size-5 text-green-500" />
                                <span className="font-medium">{step.name}</span>
                                <Separator className="flex-1 bg-border/50" />
                                <span className="font-code text-xs text-muted-foreground">{state.artifacts[`rb_step_${step.id}_artifact`]?.fileName || 'Completed'}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Submission Links</CardTitle>
                    <CardDescription>Provide the links to your project assets to finalize your submission.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="lovableLink">Lovable Project Link</Label>
                        <div className="flex items-center">
                           <span className="p-2 inline-flex items-center justify-center rounded-l-md border border-r-0 bg-muted"><LinkIcon className="size-4 text-muted-foreground"/></span>
                            <Input id="lovableLink" type="url" required placeholder="https://lovable.dev/..." value={state.lovableLink} onChange={e => setState(s => ({...s, lovableLink: e.target.value}))} className="rounded-l-none" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="githubLink">GitHub Repository Link</Label>
                         <div className="flex items-center">
                           <span className="p-2 inline-flex items-center justify-center rounded-l-md border border-r-0 bg-muted"><Github className="size-4 text-muted-foreground"/></span>
                            <Input id="githubLink" type="url" required placeholder="https://github.com/..." value={state.githubLink} onChange={e => setState(s => ({...s, githubLink: e.target.value}))} className="rounded-l-none" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="deployLink">Deployed URL</Label>
                         <div className="flex items-center">
                           <span className="p-2 inline-flex items-center justify-center rounded-l-md border border-r-0 bg-muted"><LinkIcon className="size-4 text-muted-foreground"/></span>
                            <Input id="deployLink" type="url" required placeholder="https://yourapp.com/..." value={state.deployLink} onChange={e => setState(s => ({...s, deployLink: e.target.value}))} className="rounded-l-none" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
      <footer className="flex h-20 items-center justify-between border-t bg-card px-6 shrink-0">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft /> Go Back
        </Button>
        <Button size="lg" onClick={handleCopy} disabled={!isProofComplete}>
            <Clipboard /> Copy Final Submission
        </Button>
      </footer>
    </div>
  );
}

