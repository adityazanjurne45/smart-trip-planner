## Goal
Whenever a user plans a trip, show a richer set of demo hotels whose names and locations feel authentic to the chosen destination — whether it's a country, city, or small village.

## Approach
Add a deterministic, client-side demo hotel generator that produces 6 unique hotels per destination, and merge them with the AI-generated hotels already returned by `generate-trip-recommendations`. No backend or AI changes — purely a frontend enhancement so it works offline and never costs credits.

## What will be built

### 1. New util: `src/lib/demoHotels.ts`
- `detectRegion(destination)` — reuses the same region map style as `demoFoodMenu.ts` (India, Italy, France, Japan, Thailand, Indonesia, Spain, Mexico, UAE, plus added: UK, Greece, Switzerland, Egypt, USA, global fallback).
- `detectPlaceType(destination)` — heuristic: "village" / small token → village, known capitals/metros → city, country name match → country.
- Per-region name pools split into:
  - **Prefixes** (e.g. France: `Le`, `La`, `Maison`, `Château`, `Hôtel`)
  - **Cores** (regional words: `Lumière`, `Étoile`, `Marais`, `Riviera`…)
  - **Suffixes** (`Palace`, `Residency`, `Boutique`, `Retreat`, `Inn`, `Lodge`)
- `generateDemoHotels(destination, count = 6)` — combines prefix+core+suffix deterministically (seeded by destination string) so names stay stable on re-render and never repeat within the list. Each hotel also gets:
  - `location` — realistic neighbourhood for that region (e.g. Paris → "Le Marais", Bali → "Seminyak", small village → "Village Center / Hillside / Riverside")
  - `pricePerNight`, `rating` (4.2–4.9), `distanceToCenter`
  - `amenities` (rotated from a pool)
  - `nearbyAttractions` (region-aware)
  - `isBestLocation` / `isEcoFriendly` flags spread across the list
  - `coordinates` left undefined (AI hotels may still bring real ones)

### 2. Integration in `TripRecommendations.tsx`
- After recommendations arrive, call `generateDemoHotels(destination)` and **merge**: keep AI hotels first, append demo hotels, then dedupe by lowercase name, capping at 6–8 total.
- If AI returned no hotels (failure / fallback), fully populate from the generator so the UI is never empty.

### 3. No UI changes
`SmartHotelSelection.tsx` already renders any `Hotel[]` — richer data flows in automatically. The existing card-click → `HotelDetailModal` flow stays as-is.

## Examples produced
- Paris → "Hôtel Lumière", "Le Marais Boutique", "Maison Étoile Residency"
- Jaipur → "Rajwada Heritage Palace", "Amber Haveli Retreat", "Pink City Residency"
- Bali → "Ubud Serenity Villa", "Seminyak Beach Retreat", "Tegalalang Rice Lodge"
- A village like "Kasol" → "Parvati Valley Inn", "Riverside Cottage Stay", "Hillview Village Lodge"

## Files
- **Create**: `src/lib/demoHotels.ts`
- **Edit**: `src/components/dashboard/TripRecommendations.tsx` (merge demo hotels into `recommendations.hotels`)

## Out of scope
- No edge function / AI prompt changes
- No DB changes
- No new images (existing `PlaceImageGallery` already fetches per-hotel images by name+destination)
