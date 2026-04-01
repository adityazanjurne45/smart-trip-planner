import { useState, useEffect } from 'react';
import { PlaceImage } from '@/types/trip';
import { fetchPlaceImages } from '@/lib/api/images';
import { Camera, ChevronLeft, ChevronRight, ExternalLink, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface PlaceImageGalleryProps {
  query: string;
  type: 'destination' | 'tourist_place' | 'hotel' | 'transport';
  images?: PlaceImage[];
  showGallery?: boolean;
  className?: string;
  aspectRatio?: number;
  showAttribution?: boolean;
}

const PlaceImageGallery = ({
  query,
  type,
  images: providedImages,
  showGallery = false,
  className,
  aspectRatio = 16 / 9,
  showAttribution = true,
}: PlaceImageGalleryProps) => {
  const [images, setImages] = useState<PlaceImage[]>(providedImages || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!providedImages);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (providedImages) {
      setImages(providedImages);
      setIsLoading(false);
      return;
    }

    const loadImages = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const fetchedImages = await fetchPlaceImages(query, type, showGallery ? 5 : 1);
        setImages(fetchedImages);
        if (fetchedImages.length === 0) {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [query, type, providedImages, showGallery]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setImageLoaded(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setImageLoaded(false);
  };

  const currentImage = images[currentIndex];

  if (isLoading) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl bg-muted", className)}>
        <AspectRatio ratio={aspectRatio}>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <div className="flex flex-col items-center gap-2">
              <Camera className="w-8 h-8 text-muted-foreground animate-pulse" />
              <span className="text-sm text-muted-foreground">Loading image...</span>
            </div>
          </div>
        </AspectRatio>
      </div>
    );
  }

  // Category-based fallback images from Unsplash
  const getFallbackImage = () => {
    const fallbacks: Record<string, string> = {
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
      tourist_place: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      transport: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
      destination: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
    };
    return fallbacks[type] || fallbacks.destination;
  };

  if (error || images.length === 0) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl group", className)}>
        <AspectRatio ratio={aspectRatio}>
          <img
            src={getFallbackImage()}
            alt={query}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </AspectRatio>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-xl group", className)}>
      <AspectRatio ratio={aspectRatio}>
        {/* Loading shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
        )}
        
        {/* Main image */}
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Gallery navigation */}
        {showGallery && images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setImageLoaded(false);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentIndex
                      ? "bg-white w-4"
                      : "bg-white/50 hover:bg-white/70"
                  )}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Attribution */}
        {showAttribution && currentImage && (
          <a
            href={currentImage.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/50 text-white/80 text-xs hover:text-white transition-colors"
          >
            <Camera className="w-3 h-3" />
            <span>{currentImage.photographer}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </AspectRatio>
    </div>
  );
};

export default PlaceImageGallery;
