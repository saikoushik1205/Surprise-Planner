import { router } from 'expo-router';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ExperienceCard, ExperienceSkeleton } from '@/components/experiences/ExperienceCard';
import { ExperienceFilterSheet } from '@/components/experiences/ExperienceFilterSheet';
import { Night } from '@/constants/experiencesTheme';
import { Fonts } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import {
  countActiveFilters,
  DEFAULT_EXPERIENCE_FILTERS,
  EXPERIENCE_CATEGORIES,
  filterExperiences,
  loadExperiences,
  SORT_OPTIONS,
  type Experience,
  type ExperienceFilters,
  type ExperienceSort,
} from '@/data/experiences';

export default function ExperiencesIndexScreen() {
  const { isTablet, isDesktop, horizontalPadding } = useResponsive();
  const columns = isDesktop ? 3 : isTablet ? 2 : 1;
  const [catalog, setCatalog] = useState<Experience[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [queryInput, setQueryInput] = useState('');
  const [filters, setFilters] = useState<ExperienceFilters>(DEFAULT_EXPERIENCE_FILTERS);
  const [draft, setDraft] = useState<ExperienceFilters>(DEFAULT_EXPERIENCE_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const items = await loadExperiences();
      setCatalog(items);
      setStatus('ready');
    } catch {
      setCatalog([]);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadExperiences()
      .then((items) => {
        if (cancelled) {
          return;
        }
        setCatalog(items);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setCatalog([]);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) => (current.query === queryInput ? current : { ...current, query: queryInput }));
    }, 120);
    return () => clearTimeout(timer);
  }, [queryInput]);

  const visible = useMemo(() => filterExperiences(catalog, filters), [catalog, filters]);
  const activeCount = countActiveFilters(filters);
  const sortLabel = SORT_OPTIONS.find((item) => item.id === filters.sort)?.label ?? 'Recommended';

  function openFilters() {
    setDraft(filters);
    setFilterOpen(true);
    setSortOpen(false);
  }

  function applyFilters() {
    setFilters(draft);
    setQueryInput(draft.query);
    setFilterOpen(false);
  }

  function clearFilters() {
    setDraft({ ...DEFAULT_EXPERIENCE_FILTERS, sort: filters.sort, query: '' });
    setFilters({ ...DEFAULT_EXPERIENCE_FILTERS, sort: filters.sort });
    setQueryInput('');
    setFilterOpen(false);
  }

  function setSort(sort: ExperienceSort) {
    setFilters((current) => ({ ...current, sort }));
    setSortOpen(false);
  }

  const sheetOpen = filterOpen || sortOpen;

  return (
    <View style={styles.screen}>
      <View style={styles.feedPane}>
        <ScrollView
          style={styles.scroller}
          contentContainerStyle={[styles.feed, { paddingHorizontal: horizontalPadding }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.title}>Curated Experiences</Text>
          <Text style={styles.subtitle}>Ready-to-plan surprises, crafted for unforgettable moments.</Text>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            accessibilityLabel="Search surprises"
            onChangeText={setQueryInput}
            placeholder="Search surprises..."
            placeholderTextColor={Night.subtle}
            style={styles.search}
            value={queryInput}
          />
          {queryInput ? (
            <Pressable
              accessibilityLabel="Clear search"
              accessibilityRole="button"
              onPress={() => setQueryInput('')}
              style={styles.clearSearch}>
              <X color={Night.muted} size={16} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cats}>
          {EXPERIENCE_CATEGORIES.map((category) => {
            const selected = filters.category === category;
            return (
              <Pressable
                key={category}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setFilters((current) => ({ ...current, category }))}
                style={[styles.cat, selected && styles.catOn]}>
                <Text style={[styles.catLabel, selected && styles.catLabelOn]}>{category}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.tools}>
          <Pressable accessibilityRole="button" onPress={openFilters} style={styles.tool}>
            <SlidersHorizontal color={Night.text} size={16} />
            <Text style={styles.toolLabel}>{activeCount ? `Filter (${activeCount})` : 'Filter'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => setSortOpen(true)} style={styles.tool}>
            <Text style={styles.toolLabel}>{sortLabel}</Text>
          </Pressable>
        </View>

        {status === 'loading' ? (
          <View style={styles.grid}>
            {Array.from({ length: 4 }).map((_, index) => (
              <ExperienceSkeleton key={index} />
            ))}
          </View>
        ) : null}

        {status === 'error' ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>Couldn&apos;t load experiences</Text>
            <Text style={styles.stateCopy}>Something went wrong.</Text>
            <Pressable accessibilityRole="button" onPress={() => void load()} style={styles.primary}>
              <Text style={styles.primaryLabel}>Try again</Text>
            </Pressable>
          </View>
        ) : null}

        {status === 'ready' && visible.length === 0 ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>No experiences found</Text>
            <Text style={styles.stateCopy}>Try another search or remove some filters.</Text>
            <Pressable accessibilityRole="button" onPress={clearFilters} style={styles.primary}>
              <Text style={styles.primaryLabel}>Clear filters</Text>
            </Pressable>
          </View>
        ) : null}

        {status === 'ready' && visible.length > 0 ? (
          <View style={[styles.grid, columns > 1 && styles.gridMulti]}>
            {visible.map((experience) => (
              <View key={experience.slug} style={columns > 1 ? { flex: 1, minWidth: 240, maxWidth: '50%' } : undefined}>
                <ExperienceCard
                  experience={experience}
                  onPress={() => router.push(`/experiences/${experience.slug}` as never)}
                />
              </View>
            ))}
          </View>
        ) : null}
        </ScrollView>
        {sheetOpen ? (
          <Pressable
            accessibilityLabel="Close"
            onPress={() => {
              setFilterOpen(false);
              setSortOpen(false);
            }}
            style={styles.dim}
          />
        ) : null}
      </View>

      {filterOpen ? (
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Filters</Text>
          <ExperienceFilterSheet
            draft={draft}
            onApply={applyFilters}
            onChange={setDraft}
            onClear={clearFilters}
          />
        </View>
      ) : null}

      {sortOpen ? (
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Sort</Text>
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityState={{ selected: filters.sort === option.id }}
              onPress={() => setSort(option.id)}
              style={styles.sortRow}>
              <Text style={[styles.sortLabel, filters.sort === option.id && styles.sortOn]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    backgroundColor: Night.base,
  },
  feedPane: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  scroller: {
    flex: 1,
    minHeight: 0,
  },
  feed: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 14,
  },
  hero: {
    gap: 4,
  },
  title: {
    color: Night.text,
    fontFamily: Fonts.uiBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.6,
  },
  subtitle: {
    color: Night.muted,
    fontFamily: Fonts.jakarta,
    fontSize: 14,
    lineHeight: 20,
  },
  searchWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  search: {
    width: '100%',
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: Night.card,
    borderWidth: 1,
    borderColor: Night.glass,
    color: Night.text,
    fontFamily: Fonts.jakarta,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingRight: 44,
  },
  clearSearch: {
    position: 'absolute',
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cats: {
    gap: 8,
    paddingVertical: 2,
  },
  cat: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: Night.card,
    borderWidth: 1,
    borderColor: Night.glass,
    justifyContent: 'center',
  },
  catOn: {
    backgroundColor: 'rgba(255, 45, 138, 0.2)',
    borderColor: Night.magenta,
  },
  catLabel: {
    color: Night.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 12,
  },
  catLabelOn: {
    color: Night.text,
  },
  tools: {
    flexDirection: 'row',
    gap: 8,
  },
  tool: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: Night.elevated,
    borderWidth: 1,
    borderColor: Night.glass,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  toolLabel: {
    color: Night.text,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  grid: {
    gap: 16,
    width: '100%',
  },
  gridMulti: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  state: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  stateTitle: {
    color: Night.text,
    fontFamily: Fonts.uiBold,
    fontSize: 20,
    textAlign: 'center',
  },
  stateCopy: {
    color: Night.muted,
    fontFamily: Fonts.jakarta,
    fontSize: 14,
    textAlign: 'center',
  },
  primary: {
    marginTop: 8,
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Night.magenta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    color: Night.text,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 14,
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Night.overlay,
  },
  sheet: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: Night.elevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: Night.glass,
    padding: 20,
    paddingBottom: 16,
  },
  sheetTitle: {
    color: Night.text,
    fontFamily: Fonts.uiBold,
    fontSize: 18,
    marginBottom: 12,
  },
  sortRow: {
    minHeight: 44,
    justifyContent: 'center',
  },
  sortLabel: {
    color: Night.muted,
    fontFamily: Fonts.jakarta,
    fontSize: 15,
  },
  sortOn: {
    color: Night.magenta,
    fontFamily: Fonts.jakartaSemi,
  },
});
