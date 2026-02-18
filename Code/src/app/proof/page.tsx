import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ProofPage() {
    return (
        <div className="flex flex-1 items-center justify-center p-8">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="mt-4 font-headline text-3xl">Proof of Work</CardTitle>
                    <CardDescription className="text-lg">This page is a placeholder for your project artifacts and final submission details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-48 rounded-lg border-2 border-dashed flex items-center justify-center">
                        <p className="text-muted-foreground">Artifacts will be displayed here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
