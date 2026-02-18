import { StepFlow } from "@/components/build-track/StepFlow";
import { STEPS } from "@/lib/build-track-data";
import type { Metadata } from "next";

type PageProps = {
  params: {
    stepId: string;
  };
};

export async function generateStaticParams() {
    return STEPS.map(step => ({
        stepId: step.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const step = STEPS.find(s => s.id === params.stepId);
  const stepIndex = STEPS.findIndex(s => s.id === params.stepId);
  
  if (!step) {
    return {
      title: 'Step not found',
    }
  }

  return {
    title: `Step ${stepIndex + 1}: ${step.name} | AI Resume Builder`,
  }
}

export default function StepPage({ params }: PageProps) {
  return <StepFlow stepId={params.stepId} />;
}
