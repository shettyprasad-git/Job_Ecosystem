"use client";

import { runAudit } from "@/app/actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, Siren, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> Auditing...
        </>
      ) : (
        "Audit Design"
      )}
    </Button>
  );
}

export function AiAuditTool() {
  const [state, formAction] = useFormState(runAudit, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Audit Failed",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Siren />
          AI Style Auditor
        </CardTitle>
        <CardDescription>
          Describe a component to check its consistency with the KodNest Design
          System.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <Textarea
            name="description"
            placeholder='e.g., "The primary button on the login page has a blue background, a shadow, and uses a sans-serif font at 14px."'
            rows={4}
            required
            minLength={10}
          />
          <SubmitButton />
        </form>

        {state.data && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Audit Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Overall Consistency Score</span>
                <span className="font-bold">{state.data.overallConsistencyScore}/100</span>
              </div>
              <Progress value={state.data.overallConsistencyScore} />
            </div>

            {state.data.findings.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {state.data.findings.map((finding, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        {finding.isConsistent ? (
                          <CheckCircle className="text-green-600" />
                        ) : (
                          <XCircle className="text-red-600" />
                        )}
                        <span className="font-medium">{finding.elementIdentifier}</span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{finding.category}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                        <p><strong className="text-muted-foreground">Deviation:</strong> {finding.deviation}</p>
                        {!finding.isConsistent && <p><strong className="text-muted-foreground">Suggestion:</strong> {finding.suggestion}</p>}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-secondary rounded-md">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-2"/>
                    <h4 className="font-semibold">Perfect Consistency!</h4>
                    <p className="text-sm text-muted-foreground">No deviations from the design system were found.</p>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
