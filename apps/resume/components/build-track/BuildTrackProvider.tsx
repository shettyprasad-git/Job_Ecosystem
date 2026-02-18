"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/use-local-storage';
import { STEPS } from '@/lib/build-track-data';
import { useToast } from '@/hooks/use-toast';

type StepStatus = 'locked' | 'unlocked' | 'completed';

export interface StepState {
  id: string;
  name: string;
  status: StepStatus;
}

interface BuildTrackState {
  steps: StepState[];
  artifacts: Record<string, { fileName: string; uploadedAt: string }>;
  lovableLink: string;
  githubLink: string;
  deployLink: string;
}

interface BuildTrackContextType {
  state: BuildTrackState;
  setState: (value: BuildTrackState | ((val: BuildTrackState) => BuildTrackState)) => void;
  currentStep: StepState | undefined;
  currentStepIndex: number;
  completeStep: (stepId: string, artifact: { fileName: string }) => void;
  navigateToNextStep: () => void;
  navigateToPrevStep: () => void;
  isProofComplete: boolean;
}

const initialStepsState: StepState[] = STEPS.map((step, index) => ({
  id: step.id,
  name: step.name,
  status: index === 0 ? 'unlocked' : 'locked',
}));

const initialState: BuildTrackState = {
  steps: initialStepsState,
  artifacts: {},
  lovableLink: '',
  githubLink: '',
  deployLink: '',
};

const BuildTrackContext = createContext<BuildTrackContextType | undefined>(undefined);

export const BuildTrackProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useLocalStorage<BuildTrackState>('rb_build_track_state', initialState);
  const router = useRouter();
  const { toast } = useToast();

  const currentStepIndex = state.steps.findIndex(step => step.status === 'unlocked');
  const currentStep = state.steps[currentStepIndex];
  
  const allStepsCompleted = state.steps.every(s => s.status === 'completed');
  const isProofComplete = allStepsCompleted && !!state.lovableLink && !!state.githubLink && !!state.deployLink;

  const completeStep = (stepId: string, artifact: { fileName: string }) => {
    setState(prevState => {
      const newSteps = [...prevState.steps];
      const stepIndex = newSteps.findIndex(s => s.id === stepId);

      if (stepIndex !== -1) {
        newSteps[stepIndex].status = 'completed';
        if (stepIndex + 1 < newSteps.length) {
          newSteps[stepIndex + 1].status = 'unlocked';
        }
      }
      
      const newArtifacts = {
        ...prevState.artifacts,
        [`rb_step_${stepId}_artifact`]: {
            fileName: artifact.fileName,
            uploadedAt: new Date().toISOString()
        }
      };

      return { ...prevState, steps: newSteps, artifacts: newArtifacts };
    });
    toast({
        title: "Step Complete!",
        description: `Artifact "${artifact.fileName}" uploaded.`,
    })
  };

  const navigateToNextStep = () => {
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < state.steps.length) {
      router.push(STEPS[nextStepIndex].path);
    } else if (allStepsCompleted) {
        router.push('/rb/proof');
    }
  };

  const navigateToPrevStep = () => {
    const prevStepIndex = state.steps.findIndex(s => s.id === currentStep?.id) -1;
    if (prevStepIndex >= 0) {
      router.push(STEPS[prevStepIndex].path);
    }
  };


  const value = {
    state,
    setState,
    currentStep,
    currentStepIndex: currentStepIndex !== -1 ? currentStepIndex : state.steps.length,
    completeStep,
    navigateToNextStep,
    navigateToPrevStep,
    isProofComplete
  };

  return (
    <BuildTrackContext.Provider value={value}>
      {children}
    </BuildTrackContext.Provider>
  );
};

export const useBuildTrack = () => {
  const context = useContext(BuildTrackContext);
  if (context === undefined) {
    throw new Error('useBuildTrack must be used within a BuildTrackProvider');
  }
  return context;
};
