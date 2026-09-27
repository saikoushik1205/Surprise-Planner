import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Building2, LocateFixed, MapPin, Navigation, Phone, Search, Store } from 'lucide-react-native';
import { createElement, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { BookingFrame } from '@/components/booking/BookingFrame';
import { Colors, Fonts } from '@/constants/theme';
import { usePlan } from '@/context/PlanContext';
import { CITY_COORDS } from '@/data/booking';
import { getDeviceCoords } from '@/services/deviceLocation';
import { loadPlacesLibrary } from '@/services/googleMaps';
import {
  mapEmbedUrl,
  mapImageUrl,
  resolveGooglePlace,
  reverseGeocode,
  searchPlaces,
  type PlaceHit,
} from '@/services/places';

export default function BookWhereScreen() {
  const { draft, patchDraft } = usePlan();
  const [query, setQuery] = useState(draft.area);
  const [hits, setHits] = useState<PlaceHit[]>([]);
  const [picked, setPicked] = useState(Boolean(draft.area));
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pin = useMemo(() => {
    const fallback = CITY_COORDS[draft.city] ?? CITY_COORDS.Hyderabad;
    return {
      lat: draft.lat ?? fallback.lat,
      lng: draft.lng ?? fallback.lng,
    };
  }, [draft.city, draft.lat, draft.lng]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      void loadPlacesLibrary().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const shouldSearch = !picked && query.trim().length >= 2;
    const timer = setTimeout(() => {
      if (!shouldSearch) {
        if (!cancelled) {
          setHits([]);
          setSearching(false);
        }
        return;
      }
      if (!cancelled) {
        setSearching(true);
      }
      void searchPlaces(query, draft.city)
        .then((next) => {
          if (!cancelled) {
            setHits(next);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setHits([]);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setSearching(false);
          }
        });
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [draft.city, picked, query]);

  async function applyPlace(hit: PlaceHit) {
    let next = hit;
    try {
      if (hit.source === 'google' && (!hit.lat || !hit.lng)) {
        const resolved = await resolveGooglePlace(hit.id);
        if (resolved) {
          next = {
            ...hit,
            ...resolved,
            label: resolved.label || hit.label,
            detail: resolved.detail || hit.detail,
            city: resolved.city || hit.city,
            area: resolved.area || hit.area,
            address: resolved.address || hit.address,
          };
        }
      }
    } catch {
      // Keep the typed suggestion so the user can still pin it.
    }
    if (!next.lat || !next.lng) {
      setError('Could not pin that place. Try another search result or current location.');
      return;
    }
    patchDraft({
      area: next.area,
      city: next.city || draft.city,
      lat: next.lat,
      lng: next.lng,
      placeId: next.id,
      venue: 'home',
    });
    setQuery(next.label);
    setHits([]);
    setPicked(true);
    setError(null);
  }

  async function pinCurrentLocation() {
    setLocating(true);
    setError(null);
    try {
      const { lat, lng } = await getDeviceCoords();
      const hit = await reverseGeocode(lat, lng, draft.city).catch(() => ({
        id: `geo-${lat}-${lng}`,
        label: 'Current location',
        detail: `Pinned at ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        area: 'Current location',
        city: draft.city,
        address: `Pinned current location, ${draft.city}`,
        lat,
        lng,
        source: 'osm' as const,
      }));
      await applyPlace(hit);
    } catch (locateError) {
      setError(locateError instanceof Error ? locateError.message : 'Could not read your current location.');
    } finally {
      setLocating(false);
    }
  }

  function continueMission() {
    if (draft.address.trim().length < 4) {
      setError('Add a precise flat / building so the crew can strike unseen.');
      return;
    }
    if (draft.recipientPhone.replace(/\D/g, '').length < 10) {
      setError('Add a 10-digit recipient phone for the arrival handshake.');
      return;
    }
    router.push('/book/review');
  }

  const showHits = !picked && hits.length > 0 && query.trim().length > 0;
  const noHits = !picked && !searching && query.trim().length >= 2 && hits.length === 0;
  const mapReady = Boolean(draft.lat && draft.lng);

  return (
    <BookingFrame
      stage={5}
      stageLabel="Step 05 Location & Time"
      continueDisabled={draft.address.trim().length < 4}
      onContinue={continueMission}
    >
      <View style={styles.headRow}>
        <Text style={styles.eyebrow}>Step 05B · Where</Text>
        <View style={styles.chip}>
          <MapPin color={Colors.pink} size={11} />
          <Text style={styles.chipText}>Pinpoint Target</Text>
        </View>
      </View>
      <Text style={styles.title}>Where should the crew strike?</Text>
      <Text style={styles.sub}>Search the dropzone. We&apos;ll pin it for the stealth team.</Text>

      <View style={styles.searchShell}>
        <Search color={Colors.pink} size={16} />
        <TextInput
          autoCorrect={false}
          onChangeText={(value) => {
            setPicked(false);
            setQuery(value);
          }}
          placeholder="Search stealth dropzone..."
          placeholderTextColor="#64748B"
          style={styles.search}
          value={query}
        />
        {searching ? <ActivityIndicator color={Colors.pink} size="small" /> : null}
        <Pressable accessibilityLabel="Use current location" onPress={() => void pinCurrentLocation()} style={styles.gps}>
          {locating ? <ActivityIndicator color="#38BDF8" size="small" /> : <LocateFixed color="#38BDF8" size={16} />}
        </Pressable>
      </View>

      {showHits ? (
        <View style={styles.hits}>
          {hits.map((hit) => (
            <Pressable key={hit.id} onPress={() => void applyPlace(hit)} style={styles.hit}>
              <View style={styles.hitIcon}>
                <Navigation color={Colors.pink} size={14} />
              </View>
              <View style={styles.hitCopy}>
                <Text style={styles.hitLabel}>{hit.label}</Text>
                <Text numberOfLines={1} style={styles.hitDetail}>
                  {hit.detail}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
      {noHits ? <Text style={styles.soft}>No matching dropzones. Try a nearby landmark or area.</Text> : null}

      <View style={styles.mapCard}>
        <View style={styles.map}>
          {Platform.OS === 'web' ? (
            createElement('iframe', {
              src: mapEmbedUrl(pin.lat, pin.lng),
              style: { border: 0, width: '100%', height: '100%' },
              title: 'Dropzone map',
            })
          ) : (
            <Image contentFit="cover" source={{ uri: mapImageUrl(pin.lat, pin.lng) }} style={styles.mapImage} />
          )}
          <View pointerEvents="none" style={styles.mapShade} />
          <View style={styles.pinBadge}>
            <View style={styles.live} />
            <Text numberOfLines={1} style={styles.pinText}>
              {draft.address || draft.area || draft.city}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setPicked(false);
              setQuery(draft.area || draft.city);
            }}
            style={styles.repin}
          >
            <MapPin color="#FFFFFF" size={12} />
            <Text style={styles.repinText}>Change pin</Text>
          </Pressable>
        </View>
        <Text style={styles.mapHint}>Live map pin · search a place to drop it</Text>
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>
            Flat / door / building <Text style={styles.star}>*</Text>
          </Text>
          <Text style={styles.hint}>Precise entry</Text>
        </View>
        <View style={styles.inputShell}>
          <Building2 color="#64748B" size={16} />
          <TextInput
            onChangeText={(address) => {
              patchDraft({ address, venue: 'home' });
              setError(null);
            }}
            placeholder="e.g. Flat 402, Sky High Towers"
            placeholderTextColor="#64748B"
            style={styles.input}
            value={draft.address}
          />
        </View>
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Landmark</Text>
          <Text style={styles.hint}>Visual cue</Text>
        </View>
        <View style={styles.inputShell}>
          <Store color="#64748B" size={16} />
          <TextInput
            onChangeText={(landmark) => patchDraft({ landmark })}
            placeholder="e.g. Near German Bakery, Lane 1"
            placeholderTextColor="#64748B"
            style={styles.input}
            value={draft.landmark}
          />
        </View>
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>
            Recipient phone number <Text style={styles.star}>*</Text>
          </Text>
          <Text style={styles.liveHint}>Mission delivery</Text>
        </View>
        <View style={styles.inputShell}>
          <View style={styles.cc}>
            <Text style={styles.flag}>🇮🇳</Text>
            <Text style={styles.ccText}>+91</Text>
          </View>
          <Phone color="#64748B" size={16} />
          <TextInput
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={(recipientPhone) => {
              patchDraft({ recipientPhone: recipientPhone.replace(/[^\d]/g, '') });
              setError(null);
            }}
            placeholder="98765 43210"
            placeholderTextColor="#64748B"
            style={styles.input}
            value={draft.recipientPhone}
          />
        </View>
        <View style={styles.guarantee}>
          <Text style={styles.gTitle}>Covert Guarantee</Text>
          <Text style={styles.gCopy}>We never call or spoil the surprise. Contact is only for the arrival handshake.</Text>
        </View>
      </View>

      <View style={styles.protocol}>
        <View style={styles.protocolCopy}>
          <Text style={styles.protocolTitle}>Secret Drop Protocol</Text>
          <Text style={styles.protocolLine}>Ring chime & scatter confetti instantly</Text>
        </View>
        <Switch
          onValueChange={(secretDrop) => patchDraft({ secretDrop })}
          thumbColor="#FFFFFF"
          trackColor={{ false: '#343439', true: Colors.pink }}
          value={draft.secretDrop}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!mapReady ? <Text style={styles.soft}>Search a neighbourhood to drop the map pin.</Text> : null}
    </BookingFrame>
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#292A2E',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 24,
    letterSpacing: -0.4,
  },
  sub: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  searchShell: {
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: '#1A1B20',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
  },
  search: {
    flex: 1,
    color: Colors.snow,
    fontFamily: Fonts.body,
    fontSize: 14,
    paddingVertical: 12,
  },
  gps: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#292A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hits: {
    backgroundColor: '#1A1B20',
    borderRadius: 16,
    overflow: 'hidden',
  },
  hit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  hitIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,45,120,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hitCopy: {
    flex: 1,
    minWidth: 0,
  },
  hitLabel: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  hitDetail: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
  },
  mapCard: {
    gap: 6,
  },
  map: {
    height: 168,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0D0E12',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(12,11,16,0.08)',
  },
  pinBadge: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    maxWidth: '62%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(20,20,28,0.9)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  live: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.pink,
  },
  pinText: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  repin: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.pink,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  repinText: {
    color: '#FFFFFF',
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  mapHint: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
  },
  field: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: Colors.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  star: {
    color: Colors.pink,
  },
  hint: {
    color: '#64748B',
    fontFamily: Fonts.body,
    fontSize: 11,
  },
  liveHint: {
    color: '#38BDF8',
    fontFamily: Fonts.body,
    fontSize: 11,
  },
  inputShell: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#1A1B20',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: Colors.snow,
    fontFamily: Fonts.body,
    fontSize: 14,
    paddingVertical: 12,
  },
  cc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#292A2E',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  flag: {
    fontSize: 12,
  },
  ccText: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 12,
  },
  guarantee: {
    backgroundColor: '#1A1B20',
    borderRadius: 12,
    padding: 10,
    gap: 2,
  },
  gTitle: {
    color: '#38BDF8',
    fontFamily: Fonts.jakartaExtra,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  gCopy: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  protocol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1B20',
    borderRadius: 16,
    padding: 12,
  },
  protocolCopy: {
    flex: 1,
    paddingRight: 12,
  },
  protocolTitle: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 14,
  },
  protocolLine: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
  },
  error: {
    color: '#FFB4AB',
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
  soft: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
  },
});
