import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function ProofFooter() {
  const checklistItems = [
    { id: "ui-built", label: "UI Built" },
    { id: "logic-working", label: "Logic Working" },
    { id: "test-passed", label: "Test Passed" },
    { id: "deployed", label: "Deployed" },
  ];

  return (
    <footer className="sticky bottom-0 z-10 w-full border-t bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-6 sm:gap-x-10">
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox id={item.id} />
              <Label htmlFor={item.id} className="text-sm font-medium text-foreground">
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
