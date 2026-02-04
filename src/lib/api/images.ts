import { supabase } from '@/integrations/supabase/client';
import { PlaceImage } from '@/types/trip';

type ImageType = 'destination' | 'tourist_place' | 'hotel' | 'transport';

interface FetchImagesResponse {
  success: boolean;
  images?: PlaceImage[];
  error?: string;
}

// Cache for images to avoid refetching
const imageCache = new Map<string, PlaceImage[]>();

export async function fetchPlaceImages(
  query: string,
  type: ImageType,
  count: number = 3
): Promise<PlaceImage[]> {
  const cacheKey = `${type}:${query}:${count}`;
  
  // Check cache first
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  try {
    const { data, error } = await supabase.functions.invoke<FetchImagesResponse>('fetch-place-images', {
      body: { query, type, count },
    });

    if (error) {
      console.error('Error fetching images:', error);
      return [];
    }

    if (data?.success && data.images) {
      imageCache.set(cacheKey, data.images);
      return data.images;
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return [];
  }
}

// Batch fetch images for multiple items
export async function batchFetchImages(
  items: { query: string; type: ImageType; count?: number }[]
): Promise<Map<string, PlaceImage[]>> {
  const results = new Map<string, PlaceImage[]>();
  
  // Process in parallel with a limit
  const batchSize = 5;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const promises = batch.map(async (item) => {
      const images = await fetchPlaceImages(item.query, item.type, item.count);
      return { query: item.query, images };
    });
    
    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ query, images }) => {
      results.set(query, images);
    });
  }

  return results;
}

// Clear the cache (useful for refresh scenarios)
export function clearImageCache(): void {
  imageCache.clear();
}
