'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { extractSkills } from '@/lib/skills';
import { 
  generateReadinessScore, 
  generateRoundWiseChecklist,
  generateSevenDayPlan,
  generateInterviewQuestions
} from '@/lib/analysis';
import { 
  generateCompanyIntel,
  generateDynamicRoundMapping,
} from '@/lib/company-intel';
import { saveAnalysis } from '@/lib/history';
import { AnalysisResult, SkillConfidence } from '@/lib/types';


export default function AnalyzerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [jdText, setJdText] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showJdWarning, setShowJdWarning] = useState(false);

  const handleJdChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJdText(text);
    setShowJdWarning(text.trim().length > 0 && text.trim().length < 200);
  };

  const handleAnalyze = () => {
    if (!jdText.trim()) {
      toast({
        variant: "destructive",
        title: "Job Description Required",
        description: "Please paste the job description before analyzing.",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const skills = extractSkills(jdText);
      const baseScore = generateReadinessScore(jdText, company, role, skills);
      const checklist = generateRoundWiseChecklist(skills);
      const plan = generateSevenDayPlan(skills);
      const questions = generateInterviewQuestions(skills);
      const intel = generateCompanyIntel(company);
      const dynamicRounds = generateDynamicRoundMapping(skills, intel);

      const initialConfidenceMap: { [key: string]: SkillConfidence } = {};
      Object.values(skills).flat().forEach(skill => {
        initialConfidenceMap[skill] = 'practice';
      });
      
      const now = new Date().toISOString();

      const result: AnalysisResult = {
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        company,
        role,
        jdText,
        extractedSkills: skills,
        baseScore: baseScore,
        finalScore: baseScore,
        checklist: checklist,
        plan7Days: plan,
        questions: questions,
        skillConfidenceMap: initialConfidenceMap,
        companyIntel: intel,
        roundMapping: dynamicRounds,
      };

      saveAnalysis(result);

      toast({
        title: "Analysis Complete!",
        description: "Redirecting to your results...",
      });

      router.push(`/results/${result.id}`);

    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Something went wrong. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Rocket className="h-6 w-6 text-primary" />
            <span>Placement Prep</span>
          </Link>
          <nav className="flex items-center gap-4">
             <Button variant="ghost" asChild>
               <Link href="/dashboard">Dashboard</Link>
             </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Analyze Your Job Description
            </h1>
            <p className="mt-4 max-w-[700px] mx-auto text-muted-foreground md:text-xl">
              Paste a job description below to instantly get a personalized preparation plan, key skills, and likely interview questions.
            </p>
          </div>
        </section>

        <section className="w-full pb-20 md:pb-24 lg:pb-32">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>JD Analyzer</CardTitle>
                <CardDescription>Enter the job details to start the analysis.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="jd">Job Description</Label>
                  <Textarea
                    id="jd"
                    placeholder="Paste the full job description here..."
                    className="min-h-[200px] text-base"
                    value={jdText}
                    onChange={handleJdChange}
                  />
                   {showJdWarning && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500">
                      <AlertTriangle className="h-4 w-4" />
                      <span>This JD seems short. Paste the full description for a better analysis.</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company Name (Optional)</Label>
                    <Input id="company" placeholder="e.g., Google" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role / Job Title (Optional)</Label>
                    <Input id="role" placeholder="e.g., Software Engineer Intern" value={role} onChange={(e) => setRole(e.target.value)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" onClick={handleAnalyze} disabled={isLoading} className="w-full md:w-auto">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isLoading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Placement Prep. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
