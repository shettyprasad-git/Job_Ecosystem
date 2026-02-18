'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const TEST_CHECKLIST_KEY = 'prp-test-checklist';
const TOTAL_TESTS = 10;

export default function ShipPage() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(TEST_CHECKLIST_KEY);
      if (storedState) {
        const checkedTests = JSON.parse(storedState);
        const passedCount = Object.values(checkedTests).filter(Boolean).length;
        if (passedCount === TOTAL_TESTS) {
          setIsReady(true);
        }
      }
    } catch (error) {
      console.error('Failed to check shipment status:', error);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Verifying test results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        {isReady ? (
          <>
            <CardHeader>
              <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full p-3 w-fit">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="pt-4 text-2xl">Ready to Ship!</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All pre-shipment tests have passed successfully. The application is stable and ready for deployment.
              </CardDescription>
              <Button className="mt-6 w-full" size="lg">Deploy to Production</Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
               <div className="mx-auto bg-amber-100 dark:bg-amber-900/50 rounded-full p-3 w-fit">
                <AlertTriangle className="h-12 w-12 text-amber-500" />
              </div>
              <CardTitle className="pt-4 text-2xl">Shipment Locked</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                You must complete all items on the pre-shipment checklist before you can proceed. There are still tests pending.
              </CardDescription>
              <Button asChild className="mt-6 w-full" variant="secondary" size="lg">
                <Link href="/prp/07-test">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Checklist
                </Link>
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}