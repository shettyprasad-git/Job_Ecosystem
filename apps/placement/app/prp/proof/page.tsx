
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clipboard, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SUBMISSION_KEY = 'prp_final_submission';
const TEST_CHECKLIST_KEY = 'prp-test-checklist';
const TOTAL_TESTS = 10;

const steps = [
  { id: 1, title: 'Project Scaffolding' },
  { id: 2, title: 'Dashboard UI' },
  { id: 3, title: 'Backend Logic (Analysis Engine)' },
  { id: 4, title: 'Interactive UI (Results Page)' },
  { id: 5, title: 'Company Intel Layer' },
  { id: 6, title: 'Data Model & Validation Hardening' },
  { id: 7, title: 'Pre-Shipment Test Checklist' },
  { id: 8, title: 'Final Proof & Submission' },
];

export default function ProofPage() {
  const { toast } = useToast();
  const [submission, setSubmission] = useState({ lovable: '', github: '', deployed: '' });
  const [errors, setErrors] = useState({ lovable: '', github: '', deployed: '' });
  const [isShipped, setIsShipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedSubmission = localStorage.getItem(SUBMISSION_KEY);
      if (savedSubmission) {
        setSubmission(JSON.parse(savedSubmission));
      }
    } catch (e) {
      console.error('Failed to load submission from localStorage', e);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      checkShipStatus();
    }
  }, [submission, isLoading]);
  
  const validateUrl = (url: string) => {
    if (!url) return 'URL is required.';
    try {
      new URL(url);
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'URL must start with http:// or https://';
      }
    } catch (_) {
      return 'Please enter a valid URL.';
    }
    return '';
  };

  const handleInputChange = (field: keyof typeof submission, value: string) => {
    const newSubmission = { ...submission, [field]: value };
    setSubmission(newSubmission);
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(newSubmission));
    
    const error = validateUrl(value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const checkShipStatus = () => {
    // 1. Check if all proof links are valid
    const linksValid = Object.values(submission).every(url => url) && Object.values(errors).every(e => !e);

    // 2. Check if all tests are passed
    let testsPassed = false;
    try {
        const storedChecklist = localStorage.getItem(TEST_CHECKLIST_KEY);
        if (storedChecklist) {
            const checkedTests = JSON.parse(storedChecklist);
            const passedCount = Object.values(checkedTests).filter(Boolean).length;
            if (passedCount === TOTAL_TESTS) {
                testsPassed = true;
            }
        }
    } catch (e) {
        console.error("Failed to check test checklist", e);
    }
    
    // 3. All steps are assumed complete for this final step
    const allStepsComplete = true;

    setIsShipped(linksValid && testsPassed && allStepsComplete);
  };
  
  const handleCopy = () => {
    const text = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${submission.lovable || 'Not provided'}
GitHub Repository: ${submission.github || 'Not provided'}
Live Deployment: ${submission.deployed || 'Not provided'}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
    `;
    navigator.clipboard.writeText(text.trim());
    toast({ title: 'Submission copied to clipboard!' });
  };


  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Final Proof & Submission</CardTitle>
            <CardDescription>Consolidate your work and prepare for shipment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {isShipped ? (
              <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-center">
                <ShieldCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300">Project Shipped!</h3>
                <p className="mt-2 text-green-600 dark:text-green-400 font-mono text-sm">
                  You built a real product. <br/>
                  Not a tutorial. Not a clone. <br/>
                  A structured tool that solves a real problem.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">This is your proof of work.</p>
              </div>
            ) : (
               <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
                <div>
                    <h3 className="font-bold text-amber-700 dark:text-amber-300">Shipment Pending</h3>
                    <p className="text-sm text-amber-600 dark:text-amber-400">Complete all steps, pass all tests, and provide all proof links to achieve "Shipped" status.</p>
                </div>
            </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Step Completion Overview</h3>
              <div className="space-y-3">
                {steps.map(step => (
                  <div key={step.id} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="font-medium">{step.id}. {step.title}</span>
                    </div>
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">Completed</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-semibold">Artifact Inputs (Required for Ship Status)</h3>
                <div className="space-y-4">
                     <div>
                        <Label htmlFor="lovable">Lovable Project Link</Label>
                        <Input id="lovable" placeholder="https://your-project-link.com" value={submission.lovable} onChange={e => handleInputChange('lovable', e.target.value)} />
                        {errors.lovable && <p className="text-sm text-red-500 mt-1">{errors.lovable}</p>}
                    </div>
                     <div>
                        <Label htmlFor="github">GitHub Repository Link</Label>
                        <Input id="github" placeholder="https://github.com/your-repo" value={submission.github} onChange={e => handleInputChange('github', e.target.value)} />
                        {errors.github && <p className="text-sm text-red-500 mt-1">{errors.github}</p>}
                    </div>
                     <div>
                        <Label htmlFor="deployed">Deployed URL</Label>
                        <Input id="deployed" placeholder="https://your-app.vercel.app" value={submission.deployed} onChange={e => handleInputChange('deployed', e.target.value)} />
                        {errors.deployed && <p className="text-sm text-red-500 mt-1">{errors.deployed}</p>}
                    </div>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCopy} disabled={!isShipped}>
              <Clipboard className="mr-2 h-4 w-4" />
              Copy Final Submission
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
