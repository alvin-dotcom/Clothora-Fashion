
'use client';

import { useState, useEffect } from 'react';
import type { Design, DesignProgressState } from '@/types';
import { generateClothingDesign, type GenerateClothingDesignInput } from '@/ai/flows/generate-clothing-design';
import { Button } from '@/components/ui/button';
import DesignPreview from '@/components/design/DesignPreview';
import WishlistButton from '@/components/design/WishlistButton';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { WandSparkles, ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Progress } from "@/components/ui/progress";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { setSelectedImageUrl, setGeneratedImageUrls, setCurrentStep } from '@/store/slices/designSlice';
import { startCheckout } from '@/store/slices/checkoutSlice'; // Import checkout action

// Key is no longer needed as we use Redux now
// export const DESIGN_PROGRESS_KEY = 'aiTailorDesignProgress';

export default function DesignStep3Page() {
  const dispatch: AppDispatch = useDispatch();
  const designProgress = useSelector((state: RootState) => state.design);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const [selectedDesignForActions, setSelectedDesignForActions] = useState<Design | null>(null);

  // Local state for displaying generated images, derived from Redux state.
  const [displayedGeneratedImages, setDisplayedGeneratedImages] = useState<string[] | null>(designProgress.generatedImageUrls);

  useEffect(() => {
    // Redirect if essential previous step data is missing
    if (!designProgress.basePrompt || !designProgress.filters) {
      toast({ title: "Missing Information", description: "Please complete previous steps.", variant: "destructive" });
      router.push('/design');
      return;
    }
    // Ensure the current step in Redux matches this page
    if (designProgress.currentStep !== 3) {
        dispatch(setCurrentStep(3));
    }
    // Sync local display state with Redux state
    setDisplayedGeneratedImages(designProgress.generatedImageUrls);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designProgress.basePrompt, designProgress.filters, designProgress.currentStep, designProgress.generatedImageUrls, router, toast, dispatch]);

  const constructFullPrompt = (): string => {
    if (!designProgress.basePrompt) return ''; // Added check for basePrompt
    const { basePrompt, filters } = designProgress;
    // Removed type and color from prompt construction
    return `${basePrompt}, a ${filters.material}, size ${filters.size}.`;
  };

  // Update the `selectedDesignForActions` whenever the selected image in Redux changes
  useEffect(() => {
    if (designProgress.selectedImageUrl && designProgress.basePrompt && designProgress.filters) {
      const newSelectedDesign: Design = {
        // Use imageUrl as a transient ID here, it will be finalized if added to wishlist or checkout
        id: designProgress.selectedImageUrl,
        prompt: constructFullPrompt(),
        basePrompt: designProgress.basePrompt,
        imageUrl: designProgress.selectedImageUrl,
        ...designProgress.filters, // Filters now only contain size and material
      };
      setSelectedDesignForActions(newSelectedDesign);
    } else {
      setSelectedDesignForActions(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designProgress.selectedImageUrl, designProgress.basePrompt, designProgress.filters]);


  const handleGenerateDesign = async () => {
    if (!designProgress || !designProgress.basePrompt) {
      toast({ title: "Error", description: "Design details are missing.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // Clear previously selected image and generated images in Redux and local state
    dispatch(setSelectedImageUrl(null));
    dispatch(setGeneratedImageUrls(null));
    setDisplayedGeneratedImages(null); // Update local display state
    setSelectedDesignForActions(null);

    try {
      const fullPrompt = constructFullPrompt();
      const input: GenerateClothingDesignInput = { prompt: fullPrompt };
      const result = await generateClothingDesign(input);

      // Update Redux store with the new image URLs
      dispatch(setGeneratedImageUrls(result.designImages));
      // No need to update local state `setDisplayedGeneratedImages` here,
      // as the useEffect listening to `designProgress.generatedImageUrls` will handle it.

      toast({ title: "Designs Generated!", description: "Your custom clothing designs are ready. Please select one." });
    } catch (error) {
      console.error("Error generating design:", error);
      toast({ title: "Error", description: "Could not generate designs. Please try again.", variant: "destructive" });
      dispatch(setGeneratedImageUrls(null)); // Clear on error in Redux
      // Local state `setDisplayedGeneratedImages` will update via useEffect
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    // Update selected image URL in Redux store
    dispatch(setSelectedImageUrl(imageUrl));
  };

  const handleBuyNow = () => {
    if (selectedDesignForActions) {
      // Prepare the design for checkout
      const designToCheckout: Design = {
        ...selectedDesignForActions,
         // Assign a potentially temporary ID if it's still the imageURL
         id: selectedDesignForActions.id.startsWith('data:image')
           ? new Date().toISOString() + Math.random().toString(36).substring(2,9)
           : selectedDesignForActions.id,
        _sourceInformation: 'fromDesignFlow', // Add source info
      };

      // Dispatch the startCheckout action with the design and the actual image URL
      dispatch(startCheckout({ design: designToCheckout, tempImageUrl: selectedDesignForActions.imageUrl }));
      router.push('/checkout-address');
    } else {
      toast({ title: "No Design Selected", description: "Please generate and select a design first.", variant: "destructive" });
    }
  };

  const handlePreviousStep = () => {
    dispatch(setCurrentStep(2)); // Update Redux step
    router.push('/design/customize');
  };

  // Initial loading check based on Redux state
  if (!designProgress.basePrompt || !designProgress.filters) {
    // Redirect handled by useEffect
    return <div className="container mx-auto p-4 text-center">Loading design progress...</div>;
  }

  const progressValue = 100; // Step 3 of 3

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Design Your Outfit - Step 3</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Review your choices, generate design options, and select your favorite!
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-medium text-center mb-2">Design Progress</h2>
        <Progress value={progressValue} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className="text-primary font-semibold">Describe</span>
            <span className="text-primary font-semibold">Preferences</span>
            <span className="text-primary font-semibold">Generate</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-md">
                <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Your Vision:</h3>
                    <p className="text-muted-foreground mb-4 italic">"{designProgress.basePrompt}"</p>
                    <h3 className="text-xl font-semibold mb-2">Preferences:</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {/* Removed Type and Color from display */}
                        <li>Material: <span className="font-medium text-foreground">{designProgress.filters.material}</span></li>
                        <li>Size: <span className="font-medium text-foreground">{designProgress.filters.size.toUpperCase()}</span></li>
                    </ul>
                </CardContent>
            </Card>
             <Button onClick={handleGenerateDesign} disabled={isLoading} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 shadow-md">
                {isLoading ? <LoadingSpinner size={24} /> : <WandSparkles className="mr-2 h-6 w-6" />}
                {displayedGeneratedImages && displayedGeneratedImages.length > 0 ? 'Regenerate Designs' : 'Generate Designs'}
            </Button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <DesignPreview
            imageUrls={displayedGeneratedImages} // Use local state derived from Redux
            isLoading={isLoading}
            prompt={constructFullPrompt()}
            selectedImageUrl={designProgress.selectedImageUrl} // Read selected image from Redux
            onImageSelect={handleImageSelect} // Dispatches to Redux
          />
          {selectedDesignForActions && !isLoading && (
            <Card className="shadow-md sticky bottom-4 z-10">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-center text-primary flex items-center justify-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500" /> You've selected a design!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* WishlistButton now uses Redux internally */}
                    <WishlistButton design={selectedDesignForActions} className="w-full sm:w-auto" />
                    <Button onClick={handleBuyNow} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground py-3">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Buy Now
                    </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <CardFooter className="p-0 mt-8">
          <Button onClick={handlePreviousStep} variant="outline" size="lg" className="w-full sm:w-auto text-lg py-6 shadow-md">
            <ArrowLeft className="mr-2 h-6 w-6" /> Back to Preferences
          </Button>
      </CardFooter>
    </div>
  );
}

