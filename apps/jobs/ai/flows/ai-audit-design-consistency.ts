'use server';
/**
 * @fileOverview An AI-powered tool to audit the consistency of design elements against the KodNest Premium Build System specifications.
 *
 * - auditDesignConsistency - A function that handles the design consistency auditing process.
 * - AuditDesignConsistencyInput - The input type for the auditDesignConsistency function.
 * - AuditDesignConsistencyOutput - The return type for the auditDesignConsistency function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema for the design consistency audit
const AuditDesignConsistencyInputSchema = z.object({
  designPhilosophy: z.string().describe('The core design philosophy of KodNest Premium Build System: Calm, Intentional, Coherent, Confident. Not flashy, not loud, not playful, not hackathon-style. No gradients, no glassmorphism, no neon colors, no animation noise.'),
  colorSystem: z.string().describe('The color palette and its usage rules: Background: #F7F6F3 (off-white), Primary text: #111111 (deep gray), Accent: #8B0000 (deep red), Success: muted green, Warning: muted amber. Use maximum 4 colors across entire system.'),
  typography: z.string().describe("Font families, sizes, line heights, and usage rules: Headings: 'Literata' serif font, large, confident, generous spacing. Body: 'Inter' clean sans-serif, 16–18px, line-height 1.6–1.8, max 720px for text blocks. No decorative fonts, no random sizes."),
  spacingSystem: z.string().describe('The consistent spacing scale used throughout the system: 8px, 16px, 24px, 40px, 64px. Never use random spacing like 13px, 27px, etc. Whitespace is part of design.'),
  globalLayoutStructure: z.string().describe('The enforced global layout structure for pages: [Top Bar] → [Context Header] → [Primary Workspace + Secondary Panel] → [Proof Footer].'),
  componentRules: z.string().describe('Rules for component styling: Primary button = solid deep red, Secondary = outlined. Same hover effect and border radius everywhere. Inputs: clean borders, no heavy shadows, clear focus state. Cards: subtle border, no drop shadows, balanced padding.'),
  interactionRules: z.string().describe('Rules for transitions: 150–200ms, ease-in-out, no bounce, no parallax.'),
  errorEmptyStates: z.string().describe('Rules for error and empty states: Errors: explain what went wrong + how to fix, never blame user. Empty states: provide next action, never feel dead. Everything must feel like one mind designed it. No visual drift.'),
  elementToAuditDescription: z.string().describe('A detailed textual description of the design element or section to audit, including its current styling, content, and context. E.g., "The primary button on the login page has a blue background and a shadow. The heading uses a sans-serif font and is 14px.", or "The spacing between the form fields is 10px."'),
});

export type AuditDesignConsistencyInput = z.infer<typeof AuditDesignConsistencyInputSchema>;

// Output Schema for the design consistency audit results
const AuditDesignConsistencyOutputSchema = z.object({
  overallConsistencyScore: z.number().min(0).max(100).describe('An overall score from 0 to 100 indicating the design system consistency of the audited element. 100 means perfect consistency. Lower scores indicate more deviations or more severe deviations.'),
  findings: z.array(
    z.object({
      elementIdentifier: z.string().describe('A clear identifier for the specific part of the element being audited (e.g., "Primary Button color", "H1 font family", "Spacing between elements").'),
      category: z.enum(['Color', 'Typography', 'Spacing', 'Component Style', 'Interaction', 'Layout', 'Messaging', 'General']).describe('The category of the design rule being audited (e.g., Color, Typography, Spacing, Component Style, Interaction, Layout, Messaging, General).'),
      deviation: z.string().describe('A detailed description of the detected deviation from the KodNest Premium Build System rules.'),
      suggestion: z.string().describe('A specific suggestion for how to fix the deviation to align with the design system. Be concise and direct.'),
      isConsistent: z.boolean().describe('True if this specific aspect of the element is consistent with the design system rules, false otherwise.'),
    })
  ).describe('A list of findings, detailing any inconsistencies and suggestions for remediation. If no inconsistencies are found, this array will be empty.'),
});

export type AuditDesignConsistencyOutput = z.infer<typeof AuditDesignConsistencyOutputSchema>;

export async function auditDesignConsistency(input: AuditDesignConsistencyInput): Promise<AuditDesignConsistencyOutput> {
  return auditDesignConsistencyFlow(input);
}

// Genkit Prompt definition
const auditDesignConsistencyPrompt = ai.definePrompt({
  name: 'auditDesignConsistencyPrompt',
  input: { schema: AuditDesignConsistencyInputSchema },
  output: { schema: AuditDesignConsistencyOutputSchema },
  prompt: `You are an AI Style Consistency Checker for "KodNest Premium Build System".
Your goal is to audit a given design element against the defined design system specifications provided below.
You must act as a serious, professional, and meticulous auditor. Your analysis should be calm, intentional, and confident.
Avoid any flashy, loud, playful, or hackathon-style language.
Adhere strictly to the design system's principles and specifications in your evaluation.

--- KodNest Premium Build System Specifications ---

Design Philosophy: {{{designPhilosophy}}}

Color System: {{{colorSystem}}}

Typography: {{{typography}}}

Spacing System: {{{spacingSystem}}}

Global Layout Structure: {{{globalLayoutStructure}}}

Component Rules: {{{componentRules}}}

Interaction Rules: {{{interactionRules}}}

Error and Empty States Rules: {{{errorEmptyStates}}}

---------------------------------------------------

Based on these specifications, thoroughly audit the following design element or section.
Analyze its consistency and provide clear, actionable feedback in the specified JSON format.
For each finding, provide a clear 'elementIdentifier', 'category', describe the 'deviation', suggest a precise 'suggestion', and set 'isConsistent' to true or false.
If no inconsistencies are found, the 'findings' array should be empty, and the 'overallConsistencyScore' should be 100.
The 'overallConsistencyScore' should reflect the general adherence to the rules. A single, severe deviation might lower the score significantly.

Design Element to Audit:
{{{elementToAuditDescription}}}

Provide your response in JSON format according to the output schema.`,
});

// Genkit Flow definition
const auditDesignConsistencyFlow = ai.defineFlow(
  {
    name: 'auditDesignConsistencyFlow',
    inputSchema: AuditDesignConsistencyInputSchema,
    outputSchema: AuditDesignConsistencyOutputSchema,
  },
  async (input) => {
    const { output } = await auditDesignConsistencyPrompt(input);
    return output!;
  }
);
