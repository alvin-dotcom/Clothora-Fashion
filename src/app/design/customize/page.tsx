
'use client';

import { useState, useEffect } from 'react';
import type { ClothingFilters, DesignProgressState } from '@/types';
import { Button } from '@/components/ui/button';
import FilterPanel from '@/components/design/FilterPanel';
import { useToast } from '@/hooks/use-toast';
import { CardFooter } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Progress } from "@/components/ui/progress";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { setFilters, setCurrentStep } from '@/store/slices/designSlice';

export default function DesignStep2Page() {
  const dispatch: AppDispatch = useDispatch();
  const designProgress = useSelector((state: RootState) => state.design);
  const [currentFilters, setCurrentFilters] = useState<ClothingFilters>(designProgress.filters);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Redirect if essential previous step data is missing
    if (!designProgress.basePrompt) {
      toast({ title: "Missing Information", description: "Please start from Step 1.", variant: "destructive" });
      router.push('/design');
      return;
    }
    // Ensure the current step in Redux matches this page
    if (designProgress.currentStep !== 2) {
      dispatch(setCurrentStep(2));
    }
    // Sync local filter state with Redux state
    setCurrentFilters(designProgress.filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designProgress.basePrompt, designProgress.currentStep, router, toast, dispatch]); // Added dispatch

  useEffect(() => {
    // Update local state if Redux filter state changes (e.g., browser back navigation)
    setCurrentFilters(designProgress.filters);
  }, [designProgress.filters]);


  const handleFilterChange = <K extends keyof ClothingFilters>(
    filterKey: K,
    value: ClothingFilters[K]
  ) => {
    setCurrentFilters((prev) => ({ ...prev!, [filterKey]: value }));
  };

  const handleNextStep = () => {
    dispatch(setFilters(currentFilters));
    dispatch(setCurrentStep(3));
    router.push('/design/generate');
  };

  const handlePreviousStep = () => {
    // Save current filter changes before going back
    dispatch(setFilters(currentFilters));
    dispatch(setCurrentStep(1));
    router.push('/design');
  };

  // Initial loading state check
  if (!designProgress.basePrompt) {
    return <div className="container mx-auto p-4 text-center">Loading design progress...</div>;
  }

  const progressValue = 66; // Step 2 of 3

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Design Your Outfit - Step 2</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Now, let's pick the specifics for your item.
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-medium text-center mb-2">Design Progress</h2>
        <Progress value={progressValue} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className="text-primary font-semibold">Describe</span>
            <span className="text-primary font-semibold">Preferences</span>
            <span>Generate</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Pass local state to FilterPanel, update Redux on navigation */}
        <FilterPanel filters={currentFilters} onFilterChange={handleFilterChange} />

        <CardFooter className="p-0 flex flex-col sm:flex-row gap-4 justify-between">
          <Button onClick={handlePreviousStep} variant="outline" size="lg" className="w-full sm:w-auto text-lg py-6 shadow-md">
            <ArrowLeft className="mr-2 h-6 w-6" /> Back to Prompt
          </Button>
          <Button onClick={handleNextStep} size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 shadow-md">
            Next: Generate Design <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </CardFooter>
      </div>
    </div>
  );
}
