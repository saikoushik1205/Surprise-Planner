import { Platform } from 'react-native';

const KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY ?? '';

export type AddressComponent = {
  longText?: string;
  long_name?: string;
  types: string[];
};

export type NewPlace = {
  id?: string;
  displayName?: string | { text?: string };
  formattedAddress?: string;
  location?:
    | { lat: () => number; lng: () => number }
    | { lat?: number; lng?: number; latitude?: number; longitude?: number };
  addressComponents?: AddressComponent[];
  fetchFields: (req: { fields: string[] }) => Promise<unknown>;
};

export type PlacePrediction = {
  placeId?: string;
  text?: { text?: string };
  structuredFormat?: {
    mainText?: { text?: string };
    secondaryText?: { text?: string };
  };
  toPlace: () => NewPlace;
};

export type PlacesLib = {
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions: (req: {
      input: string;
      includedRegionCodes?: string[];
    }) => Promise<{ suggestions: { placePrediction?: PlacePrediction }[] }>;
  };
  Place: (new (opts: { id: string }) => NewPlace) & {
    searchNearby?: (req: {
      fields: string[];
      locationRestriction: { center: { lat: number; lng: number }; radius: number };
      maxResultCount?: number;
    }) => Promise<{ places?: NewPlace[] }>;
  };
};

type MapsWindow = Window & {
  google?: { maps?: { importLibrary?: (name: string) => Promise<PlacesLib> } };
};

let loadPromise: Promise<PlacesLib> | null = null;

export function googleMapsKey() {
  return KEY;
}

export function hasGoogleMapsKey() {
  return KEY.length > 10;
}

export function loadPlacesLibrary(): Promise<PlacesLib> {
  if (!hasGoogleMapsKey()) {
    return Promise.reject(new Error('Google Maps key is missing.'));
  }
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps JS is only loaded on web.'));
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise<PlacesLib>((resolve, reject) => {
    const boot = async () => {
      try {
        const maps = (window as MapsWindow).google?.maps;
        if (!maps?.importLibrary) {
          reject(new Error('Google Maps loaded without importLibrary.'));
          return;
        }
        resolve(await maps.importLibrary('places'));
      } catch (error) {
        reject(error);
      }
    };

    if ((window as MapsWindow).google?.maps?.importLibrary) {
      void boot();
      return;
    }

    const callback = '__surprisePlannerMapsInit';
    (window as unknown as Record<string, () => void>)[callback] = () => {
      void boot();
    };
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}&v=weekly&libraries=places&loading=async&callback=${callback}`;
    script.async = true;
    script.onerror = () => reject(new Error('Google Maps failed to load.'));
    document.head.appendChild(script);
  }).catch((error) => {
    loadPromise = null;
    throw error;
  });

  return loadPromise;
}

export function componentName(components: AddressComponent[] | undefined, type: string) {
  const match = components?.find((item) => item.types.includes(type));
  return match?.longText || match?.long_name;
}

export function placeDisplayName(place: { displayName?: string | { text?: string } }) {
  if (!place.displayName) {
    return '';
  }
  return typeof place.displayName === 'string' ? place.displayName : place.displayName.text ?? '';
}

export function placeLatLng(place: NewPlace): { lat: number; lng: number } | null {
  const loc = place.location;
  if (!loc) {
    return null;
  }
  if (typeof (loc as { lat?: unknown }).lat === 'function') {
    return { lat: (loc as { lat: () => number }).lat(), lng: (loc as { lng: () => number }).lng() };
  }
  const literal = loc as { latitude?: number; longitude?: number; lat?: number; lng?: number };
  if (typeof literal.latitude === 'number' && typeof literal.longitude === 'number') {
    return { lat: literal.latitude, lng: literal.longitude };
  }
  if (typeof literal.lat === 'number' && typeof literal.lng === 'number') {
    return { lat: literal.lat, lng: literal.lng };
  }
  return null;
}
