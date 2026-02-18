'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertTriangle,
  CheckCircle,
  Clipboard,
  Github,
  HelpCircle,
  Link as LinkIcon,
  ListChecks,
  Loader2,
  PackageCheck,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const testItems = [
  { id: 'pref-persist', label: 'Preferences persist after refresh', hint: 'Go to Settings, change a value, refresh the page, and confirm the change is still there.' },
  { id: 'score-calculate', label: 'Match score calculates correctly', hint: 'Set specific preferences in Settings, then go to Dashboard and verify a matching job has a high score.' },
  { id: 'show-matches-toggle', label: '"Show only matches" toggle works', hint: 'On Dashboard, toggle the switch and confirm the job list filters based on your minimum match score from Settings.' },
  { id: 'save-job-persist', label: 'Save job persists after refresh', hint: 'Click the bookmark icon on a job, refresh the page, and confirm it remains saved. Check the Saved page as well.' },
  { id: 'apply-new-tab', label: 'Apply opens in new tab', hint: 'Click the "Apply" button on any job card and confirm it opens the link in a new browser tab.' },
  { id: 'status-persist', label: 'Status update persists after refresh', hint: 'Change a job\'s status (e.g., to "Applied"), refresh the page, and confirm the status remains.' },
  { id: 'status-filter', label: 'Status filter works correctly', hint: 'On Dashboard, select a status from the filter dropdown and confirm only jobs with that status are shown.' },
  { id: 'digest-generate', label: 'Digest generates top 10 by score', hint: 'Go to Digest, generate it, and verify it shows the 10 highest-scoring jobs from the Dashboard.' },
  { id: 'digest-persist', label: 'Digest persists for the day', hint: 'Generate a digest, refresh the page, and confirm the same digest loads from memory without regenerating.' },
  { id: 'no-console-errors', label: 'No console errors on main pages', hint: 'Open the browser\'s developer console and navigate through Dashboard, Saved, Digest, and Settings. Ensure no red errors appear.' },
];

const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
    } catch {
        return false;
    }
}

export default function ProofPage() {
  const { toast } = useToast();
  const [checkedState, setCheckedState] = useLocalStorage<Record<string, boolean>>(
    'kodnest_test_checklist',
    {}
  );
  const [links, setLinks] = useLocalStorage('kodnest_submission_links', {
    lovable: '',
    github: '',
    deployed: '',
  });
  const [errors, setErrors] = useState({
    lovable: '',
    github: '',
    deployed: '',
  });

  const handleCheckChange = (id: string, checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      setCheckedState((prev) => ({ ...prev, [id]: checked }));
    }
  };

  const handleLinkChange = (field: keyof typeof links, value: string) => {
    setLinks(prev => ({...prev, [field]: value}));
    if (value && !isValidUrl(value)) {
        setErrors(prev => ({...prev, [field]: 'Please enter a valid URL (e.g., https://...)'}));
    } else {
        setErrors(prev => ({...prev, [field]: ''}));
    }
  }

  const resetTests = () => {
    setCheckedState({});
  };

  const passedTestCount = Object.values(checkedState).filter(Boolean).length;
  const allTestsPassed = passedTestCount === testItems.length;
  const allLinksValid = useMemo(() => isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployed), [links]);

  const projectStatus = useMemo(() => {
    if (allTestsPassed && allLinksValid) return 'Shipped';
    if (passedTestCount > 0 || Object.values(links).some(l => l)) return 'In Progress';
    return 'Not Started';
  }, [allTestsPassed, allLinksValid, passedTestCount, links]);

  const steps = useMemo(() => [
      { name: 'Phase 1: Foundational UI & Scaffolding', completed: true },
      { name: 'Phase 2: Preference Logic & Match Scoring', completed: true },
      { name: 'Phase 3: Hydration Error Resolution', completed: true },
      { name: 'Phase 4: Daily Digest Engine', completed: true },
      { name: 'Phase 5: Navigation & Styling Polish', completed: true },
      { name: 'Phase 6: Status Tracking & Filtering', completed: true },
      { name: 'Phase 7: Built-in Test Checklist', completed: allTestsPassed },
      { name: 'Phase 8: Final Proof & Submission', completed: allTestsPassed && allLinksValid },
  ], [allTestsPassed, allLinksValid]);

  const handleCopySubmission = () => {
    if (projectStatus !== 'Shipped') {
        toast({ variant: 'destructive', title: 'Submission Incomplete', description: 'Please complete all tests and provide all links.'});
        return;
    }
    const submissionText = `
------------------------------------------
Job Notification Tracker — Final Submission

Lovable Project:
${links.lovable}

GitHub Repository:
${links.github}

Live Deployment:
${links.deployed}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced
------------------------------------------
    `.trim();

    navigator.clipboard.writeText(submissionText).then(() => {
        toast({ title: 'Submission Copied!', description: 'The formatted submission has been copied to your clipboard.'});
    });
  }

  const StatusBadge = () => {
    switch (projectStatus) {
        case 'Shipped':
            return <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600">Shipped</Badge>
        case 'In Progress':
            return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">In Progress</Badge>
        default:
            return <Badge variant="secondary">Not Started</Badge>
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Project 1 — Job Notification Tracker
            </h1>
            <StatusBadge />
          </div>
          <p className="text-slate-500 text-sm">
            Final proof and submission portal for the project.
          </p>
          {projectStatus === 'Shipped' && (
            <div className="mt-6 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle className="text-emerald-500" size={20} />
                <p className="text-sm font-bold text-emerald-800">Project 1 Shipped Successfully.</p>
            </div>
          )}
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Step Completion Summary</CardTitle>
                <CardDescription>All phases must be completed to ship the project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {steps.map(step => (
                    <div key={step.name} className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="font-semibold text-slate-700">{step.name}</span>
                        {step.completed 
                            ? <CheckCircle size={18} className="text-emerald-500" />
                            : <Loader2 size={18} className="text-slate-400 animate-spin" />
                        }
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-b-0">
                    <CardHeader>
                        <AccordionTrigger className="p-0 hover:no-underline">
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <CardTitle>Pre-Shipment Test Checklist</CardTitle>
                                    <CardDescription className="mt-1.5">
                                        <div className={`flex items-center gap-2 ${allTestsPassed ? 'text-emerald-700' : 'text-amber-700'}`}>
                                            {allTestsPassed ? <CheckCircle size={14}/> : <AlertTriangle size={14}/>}
                                            <span className="font-bold">{passedTestCount} / {testItems.length} tests passed</span>
                                        </div>
                                    </CardDescription>
                                </div>
                            </div>
                        </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent>
                        <CardContent>
                            <TooltipProvider>
                                <div className="space-y-4">
                                    {testItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
                                    >
                                        <label htmlFor={item.id} className="flex items-center gap-4 cursor-pointer">
                                        <Checkbox id={item.id} checked={!!checkedState[item.id]} onCheckedChange={(checked) => handleCheckChange(item.id, checked)} />
                                        <span className="font-bold text-slate-700">{item.label}</span>
                                        </label>
                                        <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button className="text-slate-400 hover:text-blue-600"><HelpCircle size={16} /></button>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p className="font-bold mb-1 text-xs uppercase">How to test</p>
                                            <p>{item.hint}</p>
                                        </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    ))}
                                </div>
                            </TooltipProvider>
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <Button variant="outline" onClick={resetTests}><RefreshCw className="mr-2 h-4 w-4" /> Reset Test Status</Button>
                            </div>
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Artifact Collection</CardTitle>
                <CardDescription>Provide all required links to mark the project as shipped.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="lovable" className="flex items-center gap-2 mb-2 font-bold"><PackageCheck size={16}/> Lovable Project Link</Label>
                    <Input id="lovable" placeholder="https://lovable.dev/..." value={links.lovable} onChange={(e) => handleLinkChange('lovable', e.target.value)} className={errors.lovable ? 'border-red-500' : ''}/>
                    {errors.lovable && <p className="text-red-600 text-xs mt-1">{errors.lovable}</p>}
                </div>
                 <div>
                    <Label htmlFor="github" className="flex items-center gap-2 mb-2 font-bold"><Github size={16}/> GitHub Repository Link</Label>
                    <Input id="github" placeholder="https://github.com/..." value={links.github} onChange={(e) => handleLinkChange('github', e.target.value)} className={errors.github ? 'border-red-500' : ''}/>
                    {errors.github && <p className="text-red-600 text-xs mt-1">{errors.github}</p>}
                </div>
                 <div>
                    <Label htmlFor="deployed" className="flex items-center gap-2 mb-2 font-bold"><LinkIcon size={16}/> Deployed URL</Label>
                    <Input id="deployed" placeholder="https://your-app.vercel.app" value={links.deployed} onChange={(e) => handleLinkChange('deployed', e.target.value)} className={errors.deployed ? 'border-red-500' : ''}/>
                    {errors.deployed && <p className="text-red-600 text-xs mt-1">{errors.deployed}</p>}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Final Submission</CardTitle>
                <CardDescription>Copies a formatted summary of your work for submission.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={handleCopySubmission} disabled={projectStatus !== 'Shipped'} className="w-full">
                    <Clipboard className="mr-2 h-4 w-4" /> Copy Final Submission
                </Button>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
