'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Ship } from 'lucide-react';
import { Label } from '@/components/ui/label';

const TEST_CHECKLIST_KEY = 'prp-test-checklist';

const tests = [
  { id: 'jd-required', label: 'JD required validation works', howToTest: 'Click "Analyze" with an empty JD textarea. A toast error should appear.' },
  { id: 'jd-short-warning', label: 'Short JD warning shows for <200 chars', howToTest: 'Type a short text (e.g., "hello world") in the JD textarea. A warning should appear below it.' },
  { id: 'skill-extraction', label: 'Skills extraction groups correctly', howToTest: 'Use a JD with skills like "React, Java, SQL". Verify they appear under the correct categories on the results page.' },
  { id: 'round-mapping', label: 'Round mapping changes based on company + skills', howToTest: 'Test 1: Use a "Google" JD. Test 2: Use a "Startup" JD. The interview process timeline should adapt.' },
  { id: 'score-calculation', label: 'Score calculation is deterministic', howToTest: 'Analyze the same JD twice. The "Base Score" should be identical.' },
  { id: 'skill-toggles', label: 'Skill toggles update score live', howToTest: 'On the results page, click a skill to mark it as "know". The "Final Score" should increase instantly.' },
  { id: 'persist-changes', label: 'Changes persist after refresh', howToTest: 'Toggle a few skills on the results page, then refresh. The toggles and the updated score should remain.' },
  { id: 'history-works', label: 'History saves and loads correctly', howToTest: 'Perform an analysis. Go to Dashboard -> History. Click the entry. It should load the correct results.' },
  { id: 'export-buttons', label: 'Export buttons copy the correct content', howToTest: 'On the results page, use the "Copy" and "Download" buttons. Paste the content into a text editor to verify it.' },
  { id: 'no-console-errors', label: 'No console errors on core pages', howToTest: 'Open the browser developer tools. Navigate through the Home, Dashboard, and a Results page. Check for red errors in the console.' },
];

export default function TestChecklistPage() {
  const [checkedTests, setCheckedTests] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(TEST_CHECKLIST_KEY);
      if (storedState) {
        setCheckedTests(JSON.parse(storedState));
      }
    } catch (error) {
      console.error('Failed to load test checklist state:', error);
    }
  }, []);

  const handleCheckedChange = (testId: string, isChecked: boolean) => {
    const newState = { ...checkedTests, [testId]: isChecked };
    setCheckedTests(newState);
    localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(newState));
  };

  const handleReset = () => {
    setCheckedTests({});
    localStorage.removeItem(TEST_CHECKLIST_KEY);
  };

  const passedCount = Object.values(checkedTests).filter(Boolean).length;
  const allTestsPassed = passedCount === tests.length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Pre-Shipment Test Checklist</CardTitle>
            <CardDescription>Ensure all core functionality is working before deploying.</CardDescription>
            <div className="flex items-center gap-4 pt-4">
              <span className="font-bold">Tests Passed:</span>
              <Badge variant={allTestsPassed ? 'default' : 'secondary'} className={allTestsPassed ? 'bg-green-500 hover:bg-green-600' : ''}>
                {passedCount} / {tests.length}
              </Badge>
              {!allTestsPassed && (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Fix remaining issues before shipping.</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {tests.map(test => (
              <div key={test.id} className="items-top flex space-x-3">
                <Checkbox
                  id={test.id}
                  checked={checkedTests[test.id] || false}
                  onCheckedChange={(checked) => handleCheckedChange(test.id, !!checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={test.id} className="font-medium cursor-pointer">
                    {test.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">How to test:</span> {test.howToTest}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleReset} variant="outline">Reset Checklist</Button>
            <Button asChild disabled={!allTestsPassed}>
              <Link href="/prp/08-ship">
                <Ship className="mr-2 h-4 w-4" />
                Proceed to Ship
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}