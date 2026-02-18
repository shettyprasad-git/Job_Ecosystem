'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowUp } from "lucide-react";
import { Separator } from "../ui/separator";

interface AtsScoreProps {
    score: number;
    suggestions: { text: string; points: number }[];
}

export default function AtsScore({ score, suggestions }: AtsScoreProps) {
    const getScoreInfo = () => {
        if (score < 41) return { text: "Needs Work", color: "bg-red-500", textColor: "text-red-500" };
        if (score < 71) return { text: "Getting There", color: "bg-yellow-500", textColor: "text-yellow-500" };
        return { text: "Strong Resume", color: "bg-green-500", textColor: "text-green-500" };
    }

    const scoreInfo = getScoreInfo();

    return (
        <Card>
            <CardHeader>
                <CardTitle>ATS Readiness Score</CardTitle>
                <CardDescription>How your resume might perform with automated screening systems.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <span className={`text-4xl font-bold font-headline ${scoreInfo.textColor}`}>{score}</span>
                    <div className="w-full">
                        <Progress value={score} className="h-2" indicatorClassName={scoreInfo.color} />
                        <p className={`text-sm font-semibold mt-2 ${scoreInfo.textColor}`}>{scoreInfo.text}</p>
                    </div>
                </div>
                
                <Separator />

                {suggestions.length > 0 ? (
                    <div className="space-y-3 text-sm">
                        <h4 className="font-semibold flex items-center gap-2">
                           <ArrowUp className="h-4 w-4 text-primary"/> Top Improvements
                        </h4>
                        <ul className="space-y-2 text-muted-foreground pt-1">
                            {suggestions.slice(0, 3).map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-2.5">
                                   <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0"/>
                                   <span>{suggestion.text} <span className="font-semibold text-foreground/80">(+{suggestion.points} points)</span></span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <p className="font-semibold">Your resume is looking great!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// Add this to progress component to allow custom indicator color
declare module "@/components/ui/progress" {
    interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
        indicatorClassName?: string;
    }
}
