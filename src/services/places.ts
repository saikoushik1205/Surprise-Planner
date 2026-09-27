import { Platform } from 'react-native';

import { CITY_COORDS, CITY_DROPZONES } from '@/data/booking';
import {
  componentName,
  googleMapsKey,
  hasGoogleMapsKey,
  loadPlacesLibrary,
  placeDisplayName,
  placeLatLng,
  type AddressComponent,
  type NewPlace,
} from '@/services/googleMaps';

export type PlaceHit = {
  id: string;
  label: string;
  detail: string;
  area: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  source: 'google' | 'osm' | 'local';
};

export { googleMapsKey, hasGoogleMapsKey };

type NominatimHit = {
  place_id?: number;
  display_name?: string;
  lat?: string;
  lon?: string;
  address?: {
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    state_district?: string;
  };
};

function localHits(query: string, city: string): PlaceHit[] {
  const needle = query.trim().toLowerCase();
  const zones = CITY_DROPZONES[city] ?? [];
  return zones
    .filter((zone) => !needle || zone.label.toLowerCase().includes(needle) || zone.area.toLowerCase().includes(needle))
    .map((zone) => ({
      id: `local-${city}-${zone.area}`,
      label: zone.label,
      detail: `${zone.area}, ${city}`,
      area: zone.area,
      city,
      address: `${zone.label}, ${zone.area}, ${city}`,
      lat: zone.lat,
      lng: zone.lng,
      source: 'local' as const,
    }));
}

function fromPlace(place: NewPlace, fallback: Partial<PlaceHit> = {}): PlaceHit | null {
  const coords = placeLatLng(place);
  if (!coords) {
    return null;
  }
  const label = placeDisplayName(place) || fallback.label || 'Selected place';
  const detail = place.formattedAddress || fallback.detail || label;
  return {
    id: place.id || fallback.id || `google-${coords.lat}-${coords.lng}`,
    label,
    detail,
    area:
      componentName(place.addressComponents, 'sublocality') ||
      componentName(place.addressComponents, 'neighborhood') ||
      componentName(place.addressComponents, 'sublocality_level_1') ||
      fallback.area ||
      label,
    city:
      componentName(place.addressComponents, 'locality') ||
      componentName(place.addressComponents, 'administrative_area_level_2') ||
      fallback.city ||
      '',
    address: detail,
    lat: coords.lat,
    lng: coords.lng,
    source: 'google',
  };
}

function fromNominatim(item: NominatimHit): PlaceHit | null {
  const lat = Number(item.lat);
  const lng = Number(item.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  const parts = (item.display_name ?? '').split(',').map((part) => part.trim());
  const label = parts[0] || 'Selected place';
  const area = item.address?.suburb || item.address?.neighbourhood || label;
  const city = item.address?.city || item.address?.town || item.address?.village || item.address?.state_district || '';
  return {
    id: `osm-${item.place_id ?? `${lat}-${lng}`}`,
    label,
    detail: item.display_name ?? label,
    area,
    city,
    address: item.display_name ?? label,
    lat,
    lng,
    source: 'osm',
  };
}

async function searchGoogleWeb(query: string): Promise<PlaceHit[]> {
  const places = await loadPlacesLibrary();
  const { suggestions } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input: query,
    includedRegionCodes: ['in'],
  });
  return (suggestions ?? [])
    .map((item) => item.placePrediction)
    .filter((item): item is NonNullable<typeof item> => Boolean(item?.placeId))
    .map((item) => ({
      id: item.placeId as string,
      label: item.structuredFormat?.mainText?.text || item.text?.text?.split(',')[0] || item.text?.text || 'Place',
      detail: item.structuredFormat?.secondaryText?.text || item.text?.text || '',
      area: item.structuredFormat?.mainText?.text || item.text?.text || '',
      city: item.structuredFormat?.secondaryText?.text?.split(',')[0]?.trim() || '',
      address: item.text?.text || '',
      lat: 0,
      lng: 0,
      source: 'google' as const,
    }));
}

async function searchGoogleRest(query: string): Promise<PlaceHit[]> {
  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': googleMapsKey(),
      'X-Goog-FieldMask':
        'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
    },
    body: JSON.stringify({ input: query, includedRegionCodes: ['in'] }),
  });
  if (!response.ok) {
    return [];
  }
  const json = (await response.json()) as {
    suggestions?: {
      placePrediction?: {
        placeId?: string;
        text?: { text?: string };
        structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
      };
    }[];
  };
  return (json.suggestions ?? [])
    .map((item) => item.placePrediction)
    .filter((item): item is NonNullable<typeof item> => Boolean(item?.placeId))
    .map((item) => ({
      id: item.placeId as string,
      label: item.structuredFormat?.mainText?.text || item.text?.text?.split(',')[0] || item.text?.text || 'Place',
      detail: item.structuredFormat?.secondaryText?.text || item.text?.text || '',
      area: item.structuredFormat?.mainText?.text || item.text?.text || '',
      city: item.structuredFormat?.secondaryText?.text?.split(',')[0]?.trim() || '',
      address: item.text?.text || '',
      lat: 0,
      lng: 0,
      source: 'google' as const,
    }));
}

const OSM_HEADERS = {
  Accept: 'application/json',
  'Accept-Language': 'en',
  'User-Agent': 'SurprisePlanner/1.0 (https://suprise-planner-app.onrender.com)',
};

type PhotonFeature = {
  geometry?: { coordinates?: number[] };
  properties?: {
    osm_id?: number;
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    district?: string;
  };
};

async function searchPhoton(query: string, city: string): Promise<PlaceHit[]> {
  const bias = CITY_COORDS[city] ?? CITY_COORDS.Hyderabad;
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lat=${bias.lat}&lon=${bias.lng}`;
  const response = await fetch(url, { headers: OSM_HEADERS });
  if (!response.ok) {
    return [];
  }
  const json = (await response.json()) as { features?: PhotonFeature[] };
  const hits: PlaceHit[] = [];
  for (const item of json.features ?? []) {
    const lng = item.geometry?.coordinates?.[0];
    const lat = item.geometry?.coordinates?.[1];
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      continue;
    }
    const label = item.properties?.name || item.properties?.street || 'Selected place';
    const detail = [item.properties?.name, item.properties?.street, item.properties?.city || item.properties?.district, item.properties?.state]
      .filter(Boolean)
      .join(', ');
    hits.push({
      id: `osm-${item.properties?.osm_id ?? `${lat}-${lng}`}`,
      label,
      detail: detail || label,
      area: item.properties?.district || item.properties?.name || label,
      city: item.properties?.city || city,
      address: detail || label,
      lat,
      lng,
      source: 'osm',
    });
  }
  return hits;
}

async function searchNominatim(query: string): Promise<PlaceHit[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=in&limit=6`;
  const response = await fetch(url, {
    headers: OSM_HEADERS,
  });
  if (!response.ok) {
    return [];
  }
  const json = (await response.json()) as NominatimHit[];
  return json.map(fromNominatim).filter((item): item is PlaceHit => item !== null);
}

export async function searchPlaces(query: string, city: string): Promise<PlaceHit[]> {
  const trimmed = query.trim();
  const local = localHits(trimmed, city);
  if (trimmed.length < 2) {
    return local;
  }

  const queries = city && !trimmed.toLowerCase().includes(city.toLowerCase()) ? [trimmed, `${trimmed}, ${city}`] : [trimmed];

  if (Platform.OS !== 'web') {
    for (const nextQuery of queries) {
      try {
        const photon = await searchPhoton(nextQuery, city);
        if (photon.length) {
          return photon;
        }
      } catch {
        // Native builds often lack a working Google Places key; keep searching.
      }
    }
  }

  if (hasGoogleMapsKey()) {
    try {
      const google = Platform.OS === 'web' ? await searchGoogleWeb(trimmed) : await searchGoogleRest(trimmed);
      if (google.length) {
        return google;
      }
    } catch {
      // Fall through to OSM so search never dead-ends on a rejected Google API.
    }
  }

  if (Platform.OS === 'web') {
    try {
      const photon = await searchPhoton(queries[0], city);
      if (photon.length) {
        return photon;
      }
    } catch {
      // Try Nominatim next.
    }
  }

  for (const nextQuery of queries) {
    try {
      const osm = await searchNominatim(nextQuery);
      if (osm.length) {
        return osm;
      }
    } catch {
      // Keep local neighbourhoods as the last fallback.
    }
  }

  return local;
}

function placeResourceId(placeId: string) {
  return placeId.startsWith('places/') ? placeId.slice('places/'.length) : placeId;
}

export async function resolveGooglePlace(placeId: string): Promise<PlaceHit | null> {
  if (!hasGoogleMapsKey() || placeId.startsWith('local-') || placeId.startsWith('geo-') || placeId.startsWith('osm-')) {
    return null;
  }

  if (Platform.OS === 'web') {
    const places = await loadPlacesLibrary();
    const place = new places.Place({ id: placeResourceId(placeId) });
    await place.fetchFields({
      fields: ['id', 'displayName', 'formattedAddress', 'location', 'addressComponents'],
    });
    return fromPlace(place, { id: placeId });
  }

  const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeResourceId(placeId))}`, {
    headers: {
      'X-Goog-Api-Key': googleMapsKey(),
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,addressComponents',
    },
  });
  if (!response.ok) {
    return null;
  }
  const json = (await response.json()) as {
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    location?: { latitude?: number; longitude?: number };
    addressComponents?: AddressComponent[];
  };
  return fromPlace(
    {
      id: json.id,
      displayName: json.displayName,
      formattedAddress: json.formattedAddress,
      location: json.location,
      addressComponents: json.addressComponents,
      fetchFields: async () => undefined,
    },
    { id: placeId },
  );
}

async function reversePhoton(lat: number, lng: number, fallbackCity: string): Promise<PlaceHit | null> {
  try {
    const response = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`, {
      headers: OSM_HEADERS,
    });
    if (!response.ok) {
      return null;
    }
    const json = (await response.json()) as { features?: PhotonFeature[] };
    const item = json.features?.[0];
    const label = item?.properties?.name || item?.properties?.street || 'Current location';
    const city = item?.properties?.city || fallbackCity;
    const detail = [item?.properties?.name, item?.properties?.street, city, item?.properties?.state]
      .filter(Boolean)
      .join(', ');
    return {
      id: `geo-${lat}-${lng}`,
      label,
      detail: detail || label,
      area: item?.properties?.district || item?.properties?.name || label,
      city,
      address: detail || label,
      lat,
      lng,
      source: 'osm',
    };
  } catch {
    return null;
  }
}

async function reverseNominatim(lat: number, lng: number, fallbackCity: string): Promise<PlaceHit> {
  const photon = await reversePhoton(lat, lng, fallbackCity);
  if (photon) {
    return photon;
  }
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const response = await fetch(url, { headers: OSM_HEADERS });
    if (response.ok) {
      const hit = fromNominatim((await response.json()) as NominatimHit);
      if (hit) {
        return { ...hit, id: `geo-${lat}-${lng}`, city: hit.city || fallbackCity };
      }
    }
  } catch {
    // Fall through to a usable pin.
  }
  return {
    id: `geo-${lat}-${lng}`,
    label: 'Current location',
    detail: `Pinned at ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    area: 'Current location',
    city: fallbackCity,
    address: `Pinned current location, ${fallbackCity}`,
    lat,
    lng,
    source: 'osm',
  };
}

export async function reverseGeocode(lat: number, lng: number, fallbackCity: string): Promise<PlaceHit> {
  if (hasGoogleMapsKey() && Platform.OS === 'web') {
    try {
      const places = await loadPlacesLibrary();
      if (places.Place.searchNearby) {
        const { places: nearby } = await places.Place.searchNearby({
          fields: ['id', 'displayName', 'formattedAddress', 'location', 'addressComponents'],
          locationRestriction: { center: { lat, lng }, radius: 180 },
          maxResultCount: 3,
        });
        const hit = nearby?.[0] ? fromPlace(nearby[0]) : null;
        if (hit) {
          return { ...hit, id: `geo-${lat}-${lng}`, lat, lng, city: hit.city || fallbackCity };
        }
      }
    } catch {
      // Places nearby / billing can fail; OSM still confirms the pin.
    }
  }

  return reverseNominatim(lat, lng, fallbackCity);
}

export function mapEmbedUrl(lat: number, lng: number) {
  const pad = 0.012;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - pad},${lat - pad},${lng + pad},${lat + pad}&layer=mapnik&marker=${lat},${lng}`;
}

function lon2tile(lon: number, zoom: number) {
  return Math.floor(((lon + 180) / 360) * 2 ** zoom);
}

function lat2tile(lat: number, zoom: number) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** zoom);
}

export function mapImageUrl(lat: number, lng: number) {
  const zoom = 16;
  return `https://tile.openstreetmap.org/${zoom}/${lon2tile(lng, zoom)}/${lat2tile(lat, zoom)}.png`;
}
