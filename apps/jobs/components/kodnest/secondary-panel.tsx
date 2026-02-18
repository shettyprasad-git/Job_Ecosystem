import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Camera, Heart, ThumbsDown, ThumbsUp, Wand2 } from "lucide-react";
import { AiAuditTool } from "./ai-audit-tool";
import { ClipboardButton } from "./clipboard-button";

export function SecondaryPanel() {
  const screenshotPlaceholder = PlaceHolderImages.find(p => p.id === 'screenshot-placeholder');
  const promptText = `// Create a React button component named 'PrimaryButton'
// It should accept 'children' and 'onClick' props.
// The styling should use Tailwind CSS classes.
// Base styles: px-4 py-2, rounded-md, transition-colors
// Text: white, font-semibold
// Background: bg-blue-600, Hover: bg-blue-700`;

  return (
    <div className="w-full lg:w-[35%] xl:w-[30%] space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the prompt below to generate the basic component file. This provides a starting point that you can refine.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Copyable Prompt</CardTitle>
          <ClipboardButton variant="ghost" size="sm" textToCopy={promptText}>
            Copy
          </ClipboardButton>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-secondary rounded-md text-sm text-secondary-foreground overflow-x-auto">
            <code>
              {promptText}
            </code>
          </pre>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start"><Wand2 /> Build with AI</Button>
        <Button variant="outline" className="w-full justify-start"><ThumbsUp /> It Worked</Button>
        <Button variant="outline" className="w-full justify-start"><ThumbsDown /> Report Error</Button>
        <Button variant="outline" className="w-full justify-start"><Camera /> Add Screenshot</Button>
      </div>

      {screenshotPlaceholder && (
         <Card>
            <CardHeader>
                <CardTitle className="text-lg">Proof Screenshot</CardTitle>
            </CardHeader>
            <CardContent>
                <Image 
                    src={screenshotPlaceholder.imageUrl} 
                    alt={screenshotPlaceholder.description}
                    width={600}
                    height={400}
                    className="rounded-md border"
                    data-ai-hint={screenshotPlaceholder.imageHint}
                />
            </CardContent>
         </Card>
      )}

      <Separator />

      <AiAuditTool />
    </div>
  );
}
