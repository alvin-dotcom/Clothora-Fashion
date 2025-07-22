import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { cn } from '@/lib/utils';

interface DesignPreviewProps {
  imageUrls: string[] | null;
  isLoading: boolean;
  prompt?: string;
  selectedImageUrl: string | null;
  onImageSelect: (imageUrl: string) => void;
}

export default function DesignPreview({ 
  imageUrls, 
  isLoading, 
  prompt, 
  selectedImageUrl, 
  onImageSelect 
}: DesignPreviewProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg w-full">
        <CardContent className="p-6 aspect-[4/3] flex flex-col items-center justify-center relative bg-muted/30 rounded-lg">
          <LoadingSpinner size={64} />
          <p className="mt-4 text-muted-foreground">Generating your designs...</p>
        </CardContent>
      </Card>
    );
  }

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <Card className="shadow-lg w-full">
        <CardContent className="p-6 aspect-[4/3] flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/30 rounded-lg">
          <Image 
            src="https://picsum.photos/seed/placeholderdesign/600/400?grayscale" 
            alt="Placeholder for clothing designs" 
            width={300} 
            height={200} 
            className="opacity-50 rounded-md mb-4"
            data-ai-hint="fashion sketches"
          />
          <p>Your generated designs will appear here.</p>
          <p className="text-sm">Click "Generate Designs" to start.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground">Select your favorite design:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <Card 
            key={index} 
            className={cn(
              "cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 overflow-hidden",
              selectedImageUrl === url ? "ring-2 ring-primary shadow-2xl scale-105 border-primary" : "ring-transparent border-border"
            )}
            onClick={() => onImageSelect(url)}
            role="button"
            tabIndex={0}
            aria-label={`Select design option ${index + 1}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onImageSelect(url); }}
          >
            <CardContent className="p-0 aspect-[3/4] flex items-center justify-center relative">
              <Image
                src={url}
                alt={`${prompt ? prompt.substring(0,30)+ '... ' : ''}design option ${index + 1}`}
                layout="fill"
                objectFit="cover" // Changed to cover for better aesthetics in card
                className="rounded-md"
                priority={index < 3} // Prioritize loading for the first few images
              />
              {selectedImageUrl === url && (
                <div className="absolute inset-0 bg-primary/30 flex items-center justify-center rounded-md">
                  <span className="text-primary-foreground bg-primary px-3 py-1 rounded-full text-xs font-semibold shadow-md">Selected</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
