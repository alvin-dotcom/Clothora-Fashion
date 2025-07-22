'use client';

import { useState } from 'react';
import { refineClothingPrompt, type RefineClothingPromptInput } from '@/ai/flows/refine-clothing-prompt';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wand2 } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PromptRefinerProps {
  currentPrompt: string;
  onPromptRefined: (refinedPrompt: string) => void;
}

export default function PromptRefiner({ currentPrompt, onPromptRefined }: PromptRefinerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRefinePrompt = async () => {
    if (!currentPrompt.trim()) {
      toast({ title: "Error", description: "Please enter a prompt to refine.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setRefinedPrompt(null);
    try {
      const input: RefineClothingPromptInput = { prompt: currentPrompt };
      const result = await refineClothingPrompt(input);
      setRefinedPrompt(result.refinedPrompt);
      // Optionally, immediately update the main prompt:
      // onPromptRefined(result.refinedPrompt); 
      // toast({ title: "Prompt Refined!", description: "Suggestions applied to your prompt." });
    } catch (error) {
      console.error("Error refining prompt:", error);
      toast({ title: "Error", description: "Could not refine prompt. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Refine Prompt (Optional)</CardTitle>
        <CardDescription>Let AI help you enhance your design idea.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleRefinePrompt} disabled={isLoading || !currentPrompt.trim()} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          {isLoading ? <LoadingSpinner size={20} /> : <Wand2 className="mr-2 h-4 w-4" />}
          Refine My Prompt
        </Button>
        {refinedPrompt && (
          <div className="space-y-2 p-4 border rounded-md bg-muted/50">
            <Label htmlFor="refinedPromptText">Suggested Refinement:</Label>
            <Textarea id="refinedPromptText" value={refinedPrompt} readOnly rows={3} className="bg-background"/>
            <Button variant="outline" size="sm" onClick={() => onPromptRefined(refinedPrompt)} className="mt-2">
              Use This Refinement
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
