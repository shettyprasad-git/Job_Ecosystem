"use server";

import {
  auditDesignConsistency,
  type AuditDesignConsistencyInput,
  type AuditDesignConsistencyOutput,
} from "@/ai/flows/ai-audit-design-consistency";
import { z } from "zod";

type AuditState = {
  data: AuditDesignConsistencyOutput | null;
  error: string | null;
};

const FormSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export async function runAudit(
  prevState: AuditState,
  formData: FormData
): Promise<AuditState> {
  const validatedFields = FormSchema.safeParse({
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error:
        validatedFields.error.flatten().fieldErrors.description?.join(", ") ??
        "Invalid input.",
    };
  }
  
  const { description } = validatedFields.data;

  const input: AuditDesignConsistencyInput = {
    designPhilosophy:
      "Calm, Intentional, Coherent, Confident. Not flashy, not loud, not playful, not hackathon-style. No gradients, no glassmorphism, no neon colors, no animation noise.",
    colorSystem:
      "Background: #F7F6F3 (off-white), Primary text: #111111 (deep gray), Accent: #8B0000 (deep red), Success: muted green, Warning: muted amber. Use maximum 4 colors across entire system.",
    typography:
      "Headings: 'Literata' serif font, large, confident, generous spacing. Body: 'Inter' clean sans-serif, 16–18px, line-height 1.6–1.8, max 720px for text blocks. No decorative fonts, no random sizes.",
    spacingSystem:
      "8px, 16px, 24px, 40px, 64px. Never use random spacing like 13px, 27px, etc. Whitespace is part of design.",
    globalLayoutStructure:
      "[Top Bar] → [Context Header] → [Primary Workspace + Secondary Panel] → [Proof Footer].",
    componentRules:
      "Primary button = solid deep red, Secondary = outlined. Same hover effect and border radius everywhere. Inputs: clean borders, no heavy shadows, clear focus state. Cards: subtle border, no drop shadows, balanced padding.",
    interactionRules:
      "Transitions: 150–200ms, ease-in-out, no bounce, no parallax.",
    errorEmptyStates:
      "Errors: explain what went wrong + how to fix, never blame user. Empty states: provide next action, never feel dead. Everything must feel like one mind designed it. No visual drift.",
    elementToAuditDescription: description,
  };

  try {
    const result = await auditDesignConsistency(input);
    return { data: result, error: null };
  } catch (error) {
    console.error("AI Audit Error:", error);
    return {
      data: null,
      error: "An unexpected error occurred while auditing the design.",
    };
  }
}
