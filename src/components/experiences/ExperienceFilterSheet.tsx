import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Night } from '@/constants/experiencesTheme';
import { Fonts } from '@/constants/theme';
import {
  CREW_OPTIONS,
  PRICE_OPTIONS,
  RATING_OPTIONS,
  type CrewFilter,
  type ExperienceFilters,
  type PriceFilter,
  type RatingFilter,
} from '@/data/experiences';

type ExperienceFilterSheetProps = {
  draft: ExperienceFilters;
  onChange: (next: ExperienceFilters) => void;
  onClear: () => void;
  onApply: () => void;
};

function OptionRow<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.wrap}>
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(option.id)}
              style={[styles.chip, selected && styles.chipOn]}>
              <Text style={[styles.chipLabel, selected && styles.chipLabelOn]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function ExperienceFilterSheet({ draft, onChange, onClear, onApply }: ExperienceFilterSheetProps) {
  return (
    <View>
      <OptionRow
        title="Price"
        options={PRICE_OPTIONS}
        value={draft.price}
        onChange={(price: PriceFilter) => onChange({ ...draft, price })}
      />
      <OptionRow
        title="Crew"
        options={CREW_OPTIONS}
        value={draft.crew}
        onChange={(crew: CrewFilter) => onChange({ ...draft, crew })}
      />
      <OptionRow
        title="Rating"
        options={RATING_OPTIONS}
        value={draft.rating}
        onChange={(rating: RatingFilter) => onChange({ ...draft, rating })}
      />
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onClear} style={styles.ghost}>
          <Text style={styles.ghostLabel}>Clear all</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onApply} style={styles.primary}>
          <Text style={styles.primaryLabel}>Apply filters</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 16,
    gap: 8,
  },
  groupTitle: {
    color: Night.text,
    fontFamily: Fonts.ui,
    fontSize: 14,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 36,
    borderRadius: 999,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: Night.card,
    borderWidth: 1,
    borderColor: Night.glass,
  },
  chipOn: {
    backgroundColor: 'rgba(255, 45, 138, 0.18)',
    borderColor: Night.magenta,
  },
  chipLabel: {
    color: Night.muted,
    fontFamily: Fonts.jakartaMedium,
    fontSize: 13,
  },
  chipLabelOn: {
    color: Night.text,
    fontFamily: Fonts.jakartaSemi,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  ghost: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Night.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostLabel: {
    color: Night.text,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 14,
  },
  primary: {
    flex: 1,
    minHeight: 44,
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
});
