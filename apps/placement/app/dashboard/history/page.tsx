'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getHistory } from '@/lib/history';
import { AnalysisResult } from '@/lib/types';
import { format } from 'date-fns';

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analysis History</h1>
      {history.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <p>You haven't analyzed any job descriptions yet.</p>
            <Button asChild className="mt-4">
              <Link href="/">Analyze a New JD</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {history.map((item) => (
            <Link key={item.id} href={`/results/${item.id}`} className="block">
              <Card className="h-full hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="truncate">{item.role || 'Untitled Role'}</CardTitle>
                  <CardDescription className="truncate">{item.company || 'Unknown Company'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Analyzed on {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{item.finalScore}</span>
                        <span className="text-sm text-muted-foreground">/ 100 Readiness</span>
                    </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
