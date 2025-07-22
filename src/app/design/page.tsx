
'use client';

import { useState, useEffect } from 'react';
import type { DesignProgressState } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PromptRefiner from '@/components/design/PromptRefiner';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Progress } from "@/components/ui/progress";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { setBasePrompt, setCurrentStep, resetDesignProgress } from '@/store/slices/designSlice';


export default function DesignStep1Page() {
  const dispatch: AppDispatch = useDispatch();
  const designProgress = useSelector((state: RootState) => state.design);
  const [currentBasePrompt, setCurrentBasePrompt] = useState<string>(designProgress.basePrompt);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Ensure this step is active or reset if navigation implies starting over
    if (designProgress.currentStep !== 1) {
        // Optionally reset the whole progress if user explicitly navigates back to step 1?
        // Consider if a full reset is desired or just setting the step number.
        // dispatch(resetDesignProgress()); // Uncomment for full reset
        dispatch(setCurrentStep(1)); // Just set the step number
    }
    // Sync local input state with Redux state when component mounts or Redux state changes
    setCurrentBasePrompt(designProgress.basePrompt);
  }, [designProgress.basePrompt, designProgress.currentStep, dispatch]);


  const handlePromptRefined = (refinedPrompt: string) => {
    setCurrentBasePrompt(refinedPrompt);
    // Optionally dispatch to update Redux state immediately upon refinement
    // dispatch(setBasePrompt(refinedPrompt));
    toast({ title: "Prompt Updated", description: "Refined prompt has been applied to the input field." });
  };

  const handleNextStep = () => {
    if (!currentBasePrompt.trim()) {
      toast({ title: "Error", description: "Please enter a design prompt.", variant: "destructive" });
      return;
    }
    dispatch(setBasePrompt(currentBasePrompt));
    dispatch(setCurrentStep(2));
    router.push('/design/customize');
  };

  const progressValue = 33; // Step 1 of 3

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Design Your Outfit - Step 1</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Let's start with your core idea. What are you imagining?
        </p>
      </div>

       <div className="mb-10">
        <h2 className="text-lg font-medium text-center mb-2">Design Progress</h2>
        <Progress value={progressValue} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className="text-primary font-semibold">Describe</span>
            <span>Preferences</span>
            <span>Generate</span>
        </div>
      </div>

      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>1. Describe Your Vision</CardTitle>
            <CardDescription>What are you imagining? Be as detailed or as broad as you like. Our AI will help refine it later.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="designPrompt" className="sr-only">Design Prompt</Label>
            <Textarea
              id="designPrompt"
              placeholder="e.g., 'A vintage band t-shirt with a faded logo' or 'An elegant evening gown with sparkling sequins'"
              value={currentBasePrompt}
              onChange={(e) => setCurrentBasePrompt(e.target.value)}
              rows={6}
              className="text-base"
            />
          </CardContent>
        </Card>

        <PromptRefiner currentPrompt={currentBasePrompt} onPromptRefined={handlePromptRefined} />

        <CardFooter className="p-0">
          <Button onClick={handleNextStep} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 shadow-md">
            Next: Select Preferences <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </CardFooter>
      </div>
    </div>
  );
}
