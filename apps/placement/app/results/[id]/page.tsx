'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Target, CalendarDays, HelpCircle, Trophy, Download, Copy, ClipboardPlus, Building2, Briefcase, Users, Milestone, Info } from 'lucide-react';

import { getAnalysis, updateAnalysis } from '@/lib/history';
import { generateCompanyIntel, generateDynamicRoundMapping } from '@/lib/company-intel';
import { AnalysisResult, SkillConfidence } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) {
      const analysisData = getAnalysis(id);
      if (analysisData) {
        // Migration for old history items for backward compatibility
        const migratedData: AnalysisResult = { ...analysisData } as any;

        if (!migratedData.updatedAt) migratedData.updatedAt = migratedData.createdAt;
        if (migratedData.baseScore === undefined) migratedData.baseScore = (migratedData as any).baseReadinessScore || (migratedData as any).readinessScore || 0;
        if (migratedData.finalScore === undefined) migratedData.finalScore = (migratedData as any).readinessScore || migratedData.baseScore || 0;

        if (!migratedData.skillConfidenceMap) {
          const initialConfidenceMap: { [key: string]: SkillConfidence } = {};
          const allSkills = Object.values(migratedData.extractedSkills || {}).flat();
          allSkills.forEach(skill => {
            initialConfidenceMap[skill] = 'practice';
          });
          migratedData.skillConfidenceMap = initialConfidenceMap;
        }

        if (!migratedData.companyIntel && migratedData.company) {
          migratedData.companyIntel = generateCompanyIntel(migratedData.company);
        }
        if (!migratedData.roundMapping) {
           migratedData.roundMapping = (migratedData as any).dynamicRoundMapping || generateDynamicRoundMapping(migratedData.extractedSkills, migratedData.companyIntel);
        }

        // Rename old fields
        if ((migratedData as any).roundWiseChecklist) {
          migratedData.checklist = (migratedData as any).roundWiseChecklist.map((r: any) => ({ roundTitle: r.title, items: r.items }));
        }
        if ((migratedData as any).sevenDayPlan) {
          migratedData.plan7Days = (migratedData as any).sevenDayPlan.map((d: any) => ({ day: d.day, focus: d.topic, tasks: d.tasks }));
        }
        if ((migratedData as any).interviewQuestions) {
          migratedData.questions = (migratedData as any).interviewQuestions;
        }


        setResult(migratedData);
        if (JSON.stringify(analysisData) !== JSON.stringify(migratedData)) {
            updateAnalysis(migratedData); // save migrated data
        }
      }
      setIsLoading(false);
    }
  }, [id]);

  const liveFinalScore = useMemo(() => {
    if (!result) return 0;
    
    let skillAdjustment = 0;
    if (result.skillConfidenceMap) {
        const allSkills = Object.values(result.extractedSkills).flat();
        for (const skill of allSkills) {
            if (result.skillConfidenceMap[skill] === 'know') {
                skillAdjustment += 2;
            }
        }
    }
    const score = result.baseScore + skillAdjustment;
    return Math.max(0, Math.min(100, score));
  }, [result]);

  const handleSkillToggle = (skill: string) => {
    if (!result) return;

    const newConfidenceMap = { ...result.skillConfidenceMap };
    newConfidenceMap[skill] = newConfidenceMap[skill] === 'know' ? 'practice' : 'know';

    const updatedResult = { 
        ...result, 
        skillConfidenceMap: newConfidenceMap,
        updatedAt: new Date().toISOString(),
    };
    
    // Calculate new final score and include it in the update
    let skillAdjustment = 0;
    const allSkills = Object.values(updatedResult.extractedSkills).flat();
    for (const s of allSkills) {
        if (newConfidenceMap[s] === 'know') {
            skillAdjustment += 2;
        }
    }
    updatedResult.finalScore = Math.max(0, Math.min(100, updatedResult.baseScore + skillAdjustment));

    setResult(updatedResult);
    updateAnalysis(updatedResult);
  };
  
  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied to clipboard!", description: `${title} copied.` });
    }).catch(err => {
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy to clipboard." });
    });
  };

  const formatChecklistForExport = () => result?.checklist.map(r => `## ${r.roundTitle}\n\n${r.items.map(i => `- ${i}`).join('\n')}`).join('\n\n') || '';
  const formatPlanForExport = () => result?.plan7Days.map(d => `## ${d.day}: ${d.focus}\n\n${d.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n') || '';
  const formatQuestionsForExport = () => result?.questions.map((q, i) => `${i + 1}. ${q}`).join('\n') || '';

  const handleDownload = () => {
    if (!result) return;
    const { company, role } = result;
    const allSkills = Object.entries(result.extractedSkills).filter(([, skills]) => skills.length > 0);
    const text = `
# Placement Prep Analysis for ${role} at ${company}

## Key Skills
${allSkills.map(([category, skills]) => `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n- ${skills.join(', ')}`).join('\n')}

---

${formatChecklistForExport()}

---

${formatPlanForExport()}

---

## 10 Likely Interview Questions
${formatQuestionsForExport()}
    `;
    const blob = new Blob([text.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-prep-${company}-${role}.txt`.replace(/ /g, '_');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading analysis...</div>;
  }

  if (!result) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Analysis Not Found</h1>
        <p className="text-muted-foreground">The requested analysis does not exist or has been deleted.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Analyze a New JD
          </Link>
        </Button>
      </div>
    );
  }

  const { company, role, extractedSkills, checklist, plan7Days, questions, companyIntel, roundMapping } = result;
  const score = liveFinalScore;
  const readinessColor = score > 75 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500';
  const weakSkills = Object.entries(result.skillConfidenceMap || {}).filter(([, conf]) => conf === 'practice').map(([skill]) => skill);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Button variant="ghost" asChild>
             <Link href="/dashboard/history">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg truncate">{role || "Analysis"} at {company || "Company"}</h2>
          </div>
          <Button asChild>
            <Link href="/">Analyze New JD</Link>
          </Button>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>Key Skills Self-Assessment</CardTitle>
                 <CardDescription>Toggle skills you know to update your readiness score.</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(extractedSkills).filter(([, skills]) => skills.length > 0).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(extractedSkills).filter(([, skills]) => skills.length > 0).map(([category, skills]) => (
                      <div key={category}>
                        <h3 className="font-semibold mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.map(skill => (
                            <Button 
                              key={skill} 
                              variant={result.skillConfidenceMap?.[skill] === 'know' ? 'default' : 'secondary'}
                              size="sm"
                              className="h-auto py-1 px-3 text-xs"
                              onClick={() => handleSkillToggle(skill)}
                            >
                              {skill}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-muted-foreground">No specific skills detected. Showing general recommendations.</p>}
              </CardContent>
            </Card>

            {companyIntel && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Building2 className="text-primary"/>Company Intel</CardTitle>
                        <CardDescription>Heuristically generated insights about {companyIntel.name}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-3">
                                <Briefcase className="h-8 w-8 text-primary/80"/>
                                <div>
                                    <p className="text-muted-foreground">Industry</p>
                                    <p className="font-semibold">{companyIntel.industry}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="h-8 w-8 text-primary/80"/>
                                <div>
                                    <p className="text-muted-foreground">Est. Size</p>
                                    <p className="font-semibold">{companyIntel.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Target className="h-8 w-8 text-primary/80"/>
                                <div>
                                    <p className="text-muted-foreground">Hiring Focus</p>
                                    <p className="font-semibold">{companyIntel.hiringFocus}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-secondary/50 rounded-lg">
                            <p className="font-semibold text-primary">Typical Hiring Focus: {companyIntel.hiringFocus}</p>
                            <p className="text-sm text-muted-foreground mt-1">{companyIntel.hiringFocusDescription}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted rounded-md">
                            <Info className="h-4 w-4" />
                            <p><span className="font-semibold">Demo Mode:</span> Company intel is generated heuristically and may not be fully accurate.</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {roundMapping && roundMapping.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Milestone className="text-primary"/>Typical Interview Process</CardTitle>
                        <CardDescription>A likely interview timeline based on the company profile and role.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative pl-6">
                            <div className="absolute left-9 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                            <div className="space-y-8">
                                {roundMapping.map((round, index) => (
                                    <div key={index} className="relative flex items-start">
                                        <div className="z-10 absolute left-9 top-1 h-8 w-8 bg-primary rounded-full flex items-center justify-center -translate-x-1/2">
                                          <span className="text-primary-foreground font-bold">{round.round}</span>
                                        </div>
                                        <div className="pl-12 pt-1">
                                            <p className="font-bold text-lg text-primary">{round.title}</p>
                                            <p className="font-semibold">{round.focus}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{round.whyItMatters}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}


            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 m-0"><Target className="text-primary"/>Generic Preparation Checklist</CardTitle>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatChecklistForExport(), 'Checklist')}><Copy className="mr-2 h-4 w-4"/>Copy</Button>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible defaultValue="item-0">
                  {checklist.map((round, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{round.roundTitle}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc space-y-2 pl-5">
                          {round.items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 m-0"><CalendarDays className="text-primary"/>Your 7-Day Preparation Plan</CardTitle>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatPlanForExport(), '7-Day Plan')}><Copy className="mr-2 h-4 w-4"/>Copy</Button>
              </CardHeader>
              <CardContent>
                 <Accordion type="single" collapsible>
                  {plan7Days.map((day, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{day.day}: {day.focus}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc space-y-2 pl-5">
                          {day.tasks.map((task, i) => <li key={i}>{task}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 m-0"><HelpCircle className="text-primary"/>10 Likely Interview Questions</CardTitle>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatQuestionsForExport(), 'Questions')}><Copy className="mr-2 h-4 w-4"/>Copy</Button>
              </CardHeader>
              <CardContent>
                <ul className="list-decimal space-y-3 pl-5">
                  {questions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="sticky top-24">
              <CardHeader className="text-center pb-2">
                <CardTitle className="flex items-center justify-center gap-2"><Trophy className="text-primary"/>Your Readiness Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                 <div className={`text-7xl font-bold ${readinessColor}`}>{score}
                    <span className="text-4xl text-muted-foreground">/100</span>
                 </div>
                 <CardDescription className="mt-2">
                    This score reflects your profile's alignment with the job description, adjusted for your self-assessed skills.
                 </CardDescription>
                 <Button className="mt-6 w-full" onClick={handleDownload}><Download className="mr-2"/>Download Full Report</Button>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ClipboardPlus className="text-primary" />Action Next</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold mb-2">Focus on your weak areas:</p>
                    {weakSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {weakSkills.slice(0, 3).map(skill => (
                                <Badge key={skill} variant="destructive">{skill}</Badge>
                            ))}
                        </div>
                    ) : (
                         <p className="text-sm text-muted-foreground mb-4">You've marked all skills as known. Great job!</p>
                    )}
                    <Button className="w-full" asChild>
                        <Link href="/dashboard/practice">Start Day 1 Plan Now</Link>
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
