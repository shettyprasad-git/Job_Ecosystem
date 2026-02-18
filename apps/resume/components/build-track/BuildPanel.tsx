"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clipboard, UploadCloud, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBuildTrack } from "./BuildTrackProvider";
import React from "react";

type BuildPanelProps = {
  stepId: string;
  lovablePrompt: string;
};

export function BuildPanel({ stepId, lovablePrompt }: BuildPanelProps) {
  const { toast } = useToast();
  const { completeStep, state } = useBuildTrack();

  const artifactKey = `rb_step_${stepId}_artifact`;
  const artifact = state.artifacts[artifactKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(lovablePrompt);
    toast({ title: "Copied to clipboard!" });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      completeStep(stepId, { fileName: file.name });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            Build Artifact
          </CardTitle>
          <CardDescription>
            Use the prompt below and upload your result.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Copy This Into Lovable</Label>
            <Textarea
              readOnly
              value={lovablePrompt}
              className="h-48 font-code text-xs"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full" onClick={handleCopy}>
              <Clipboard /> Copy
            </Button>
            <Button asChild className="w-full">
              <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer">Build in Lovable</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="font-headline">Upload Artifact</CardTitle>
          <CardDescription>
            Upload a screenshot or file to mark this step as complete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {artifact ? (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-green-500 bg-green-500/10 p-8 text-center">
                <div className="text-green-500">
                    <FileText className="mx-auto size-8" />
                    <p className="mt-2 font-semibold">Artifact Uploaded</p>
                    <p className="font-code text-sm text-muted-foreground">{artifact.fileName}</p>
                </div>
            </div>
          ) : (
            <div className="relative">
              <Input
                id="screenshot"
                type="file"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileChange}
              />
              <Label
                htmlFor="screenshot"
                className="flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground transition-colors hover:border-primary hover:bg-accent"
              >
                <UploadCloud className="size-8" />
                <span className="font-medium">Add Screenshot</span>
                <span>Click or drag file to upload</span>
              </Label>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
