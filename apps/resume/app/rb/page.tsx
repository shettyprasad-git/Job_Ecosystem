"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBuildTrack } from '@/components/build-track/BuildTrackProvider';
import { Skeleton } from '@/components/ui/skeleton';

export default function RBRedirectPage() {
  const { state, currentStep } = useBuildTrack();
  const router = useRouter();

  useEffect(() => {
    const allCompleted = state.steps.every(s => s.status === 'completed');

    if (allCompleted) {
      router.replace('/rb/proof');
    } else if (currentStep) {
      router.replace(`/rb/${currentStep.id}`);
    }
  }, [currentStep, state.steps, router]);

  return (
     <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-4xl space-y-8 p-4">
        <Skeleton className="h-16 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <div className="flex gap-4">
            <Skeleton className="h-64 w-2/3" />
            <Skeleton className="h-64 w-1/3" />
        </div>
      </div>
    </div>
  );
}
