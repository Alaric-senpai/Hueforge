'use server';
/**
 * @fileOverview A color palette auto-tagging AI agent.
 *
 * - suggestPaletteTags - A function that suggests tags for a color palette.
 * - SuggestPaletteTagsInput - The input type for the suggestPaletteTags function.
 * - SuggestPaletteTagsOutput - The return type for the suggestPaletteTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPaletteTagsInputSchema = z.object({
  colors: z
    .array(z.string().regex(/^#[0-9A-Fa-f]{6}$/))
    .describe('An array of hex color codes representing the color palette.'),
});
export type SuggestPaletteTagsInput = z.infer<typeof SuggestPaletteTagsInputSchema>;

const SuggestPaletteTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the color palette.'),
});
export type SuggestPaletteTagsOutput = z.infer<typeof SuggestPaletteTagsOutputSchema>;

export async function suggestPaletteTags(input: SuggestPaletteTagsInput): Promise<SuggestPaletteTagsOutput> {
  return suggestPaletteTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPaletteTagsPrompt',
  input: {schema: SuggestPaletteTagsInputSchema},
  output: {schema: SuggestPaletteTagsOutputSchema},
  prompt: `You are a color palette expert. Given a color palette consisting of hex codes, suggest relevant tags that describe the palette.

Colors: {{{colors}}}

Tags:`,
});

const suggestPaletteTagsFlow = ai.defineFlow(
  {
    name: 'suggestPaletteTagsFlow',
    inputSchema: SuggestPaletteTagsInputSchema,
    outputSchema: SuggestPaletteTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
