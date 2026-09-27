import { router } from 'expo-router';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MoonStar,
  Sparkles,
  Sun,
  Zap,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BookingFrame } from '@/components/booking/BookingFrame';
import { Colors, Fonts } from '@/constants/theme';
import { usePlan } from '@/context/PlanContext';
import {
  BOOKING_SLOTS,
  buildMonthCells,
  buildUpcomingDays,
  formatClockLabel,
  formatMonthYear,
  formatShortDate,
  parseClock,
  parseIsoDate,
  toClock,
  toIsoDate,
} from '@/data/booking';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = [0, 15, 30, 45];

const SLOT_ICONS = {
  midnight: MoonStar,
  evening: Sparkles,
  morning: Sun,
  custom: Clock,
} as const;

export default function BookWhenScreen() {
  const { draft, patchDraft } = usePlan();
  const [error, setError] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(draft.dateChoice === 'custom');
  const selected = parseIsoDate(draft.date) ?? new Date();
  const [cursor, setCursor] = useState({ year: selected.getFullYear(), month: selected.getMonth() });
  const days = useMemo(() => buildUpcomingDays(14), []);
  const cells = useMemo(() => buildMonthCells(cursor.year, cursor.month), [cursor.month, cursor.year]);
  const clock = parseClock(draft.time || '19:00');
  const today = toIsoDate(new Date());
  const tomorrow = days[1]?.iso;

  function applyDate(iso: string) {
    const choice = iso === today ? 'today' : iso === tomorrow ? 'tomorrow' : 'custom';
    patchDraft({ date: iso, dateChoice: choice });
    setError(null);
  }

  function pickSlot(id: string, value: string) {
    patchDraft({ slot: id, time: value || draft.time || '19:00' });
    setError(null);
  }

  function setCustomTime(hour: number, minute: number, period: 'AM' | 'PM') {
    patchDraft({ slot: 'custom', time: toClock(hour, minute, period) });
  }

  function shiftMonth(delta: number) {
    setCursor((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  function continueMission() {
    if (!draft.date) {
      setError('Pick a date for the drop.');
      return;
    }
    if (!draft.slot) {
      setError('Pick an execution window.');
      return;
    }
    router.push('/book/where');
  }

  return (
    <BookingFrame stage={5} stageLabel="Step 05 Location & Time" continueDisabled={!draft.slot} onContinue={continueMission}>
      <View style={styles.head}>
        <View style={styles.headRow}>
          <Text style={styles.eyebrow}>Step 05A · When</Text>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Time Infiltration</Text>
          </View>
        </View>
        <Text style={styles.title}>When should the moment hit?</Text>
        <Text style={styles.sub}>Pick the date and arrival window for the surprise drop.</Text>
      </View>

      <View style={styles.block}>
        <View style={styles.labelRow}>
          <Text style={styles.micro}>Select date *</Text>
          <Text style={styles.hint}>IST (UTC+5:30)</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
          {days.map((day) => {
            const on = draft.date === day.iso;
            return (
              <Pressable
                key={day.iso}
                accessibilityRole="button"
                onPress={() => applyDate(day.iso)}
                style={[styles.dayCard, on && styles.dayOn]}
              >
                <Text style={[styles.dayLabel, on && styles.onText]}>{day.label}</Text>
                <Text style={[styles.dayNum, on && styles.onText]}>{day.day}</Text>
                {on ? <View style={styles.dayDot} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          accessibilityRole="button"
          onPress={() => setCalendarOpen((open) => !open)}
          style={[styles.calendarToggle, calendarOpen && styles.calendarToggleOn]}
        >
          <CalendarDays color={calendarOpen ? '#FFFFFF' : Colors.pink} size={16} />
          <Text style={[styles.calendarToggleText, calendarOpen && styles.onText]}>
            {calendarOpen ? 'Hide calendar' : 'Open full calendar'}
          </Text>
          <Text style={[styles.selectedDate, calendarOpen && styles.onText]}>{formatShortDate(draft.date)}</Text>
        </Pressable>

        {calendarOpen ? (
          <View style={styles.calendar}>
            <View style={styles.monthBar}>
              <Pressable accessibilityRole="button" onPress={() => shiftMonth(-1)} style={styles.monthBtn}>
                <ChevronLeft color={Colors.snow} size={18} />
              </Pressable>
              <Text style={styles.monthTitle}>{formatMonthYear(cursor.year, cursor.month)}</Text>
              <Pressable accessibilityRole="button" onPress={() => shiftMonth(1)} style={styles.monthBtn}>
                <ChevronRight color={Colors.snow} size={18} />
              </Pressable>
            </View>
            <View style={styles.weekRow}>
              {WEEKDAYS.map((day, index) => (
                <Text key={`${day}-${index}`} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>
            <View style={styles.grid}>
              {cells.map((cell, index) => {
                const on = Boolean(cell.iso && cell.iso === draft.date);
                const isToday = cell.iso === today;
                return (
                  <Pressable
                    key={`${cell.iso ?? 'empty'}-${index}`}
                    disabled={!cell.iso || cell.past}
                    onPress={() => cell.iso && applyDate(cell.iso)}
                    style={[styles.cell, on && styles.cellOn, cell.past && styles.cellPast]}
                  >
                    <Text style={[styles.cellText, on && styles.onText, isToday && !on && styles.todayText]}>
                      {cell.day ?? ''}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.block}>
        <View style={styles.labelRow}>
          <Text style={styles.micro}>Execution window *</Text>
          <View style={styles.precise}>
            <Check color={Colors.pink} size={12} />
            <Text style={styles.preciseText}>Guaranteed precision</Text>
          </View>
        </View>

        <View style={styles.slots}>
          {BOOKING_SLOTS.map((item) => {
            const on = draft.slot === item.id;
            const Icon = SLOT_ICONS[item.id];
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => pickSlot(item.id, item.clock)}
                style={[styles.slot, on && styles.slotOn]}
              >
                <View style={[styles.slotIcon, on && styles.slotIconOn]}>
                  <Icon color={on ? '#FFFFFF' : Colors.pink} size={18} />
                </View>
                <View style={styles.slotCopy}>
                  <View style={styles.slotRow}>
                    <Text style={styles.slotName}>{item.label}</Text>
                    {item.badge ? <Text style={styles.hit}>{item.badge}</Text> : null}
                  </View>
                  <Text style={[styles.slotTime, on && styles.slotTimeOn]}>
                    {item.id === 'custom' && draft.time ? formatClockLabel(draft.time) : item.time}
                  </Text>
                </View>
                <View style={[styles.check, on && styles.checkOn]}>{on ? <Check color="#FFFFFF" size={14} /> : null}</View>
              </Pressable>
            );
          })}
        </View>

        {draft.slot === 'custom' ? (
          <View style={styles.timePicker}>
            <Text style={styles.timeTitle}>Set the exact minute</Text>
            <Text style={styles.timePreview}>{formatClockLabel(draft.time || '19:00')}</Text>

            <Text style={styles.wheelLabel}>Hour</Text>
            <View style={styles.wheel}>
              {HOURS.map((hour) => {
                const on = clock.hour === hour;
                return (
                  <Pressable key={hour} onPress={() => setCustomTime(hour, clock.minute, clock.period)} style={[styles.tick, on && styles.tickOn]}>
                    <Text style={[styles.tickText, on && styles.onText]}>{hour}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.wheelLabel}>Minute</Text>
            <View style={styles.wheel}>
              {MINUTES.map((minute) => {
                const on = clock.minute === minute;
                return (
                  <Pressable key={minute} onPress={() => setCustomTime(clock.hour, minute, clock.period)} style={[styles.tickWide, on && styles.tickOn]}>
                    <Text style={[styles.tickText, on && styles.onText]}>{String(minute).padStart(2, '0')}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.periodRow}>
              {(['AM', 'PM'] as const).map((period) => {
                const on = clock.period === period;
                return (
                  <Pressable key={period} onPress={() => setCustomTime(clock.hour, clock.minute, period)} style={[styles.period, on && styles.periodOn]}>
                    <Text style={[styles.periodText, on && styles.onText]}>{period}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.note}>
        <Zap color={Colors.pink} size={16} />
        <Text style={styles.noteText}>
          Operatives stage stealthily <Text style={styles.noteStrong}>15 mins prior</Text> to verify target visual.
        </Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </BookingFrame>
  );
}

const styles = StyleSheet.create({
  head: {
    gap: 6,
  },
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
    backgroundColor: '#292A2E',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    color: Colors.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
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
    marginTop: 2,
  },
  block: {
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  micro: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  hint: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
  },
  strip: {
    gap: 8,
    paddingVertical: 2,
  },
  dayCard: {
    width: 64,
    minHeight: 76,
    borderRadius: 16,
    backgroundColor: '#1F1F24',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  dayOn: {
    backgroundColor: Colors.pink,
    boxShadow: '0 0 18px rgba(255,45,120,0.35)',
  },
  dayLabel: {
    color: Colors.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  dayNum: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 20,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  onText: {
    color: '#FFFFFF',
  },
  calendarToggle: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: '#1A1B20',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  calendarToggleOn: {
    backgroundColor: Colors.pink,
  },
  calendarToggleText: {
    flex: 1,
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  selectedDate: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
  },
  calendar: {
    backgroundColor: '#1A1B20',
    borderRadius: 18,
    padding: 12,
    gap: 10,
  },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#292A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 15,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: Colors.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  cellOn: {
    backgroundColor: Colors.pink,
  },
  cellPast: {
    opacity: 0.28,
  },
  cellText: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  todayText: {
    color: Colors.pink,
  },
  precise: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  preciseText: {
    color: Colors.pink,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  slots: {
    gap: 8,
  },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1F1F24',
    borderRadius: 16,
    padding: 12,
  },
  slotOn: {
    backgroundColor: '#292A2E',
    boxShadow: '0 0 18px rgba(255,45,120,0.25)',
  },
  slotIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#343439',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotIconOn: {
    backgroundColor: Colors.pink,
    boxShadow: '0 0 12px rgba(255,45,120,0.5)',
  },
  slotCopy: {
    flex: 1,
    minWidth: 0,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slotName: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 15,
  },
  hit: {
    color: '#FFFFFF',
    backgroundColor: Colors.pink,
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 9,
  },
  slotTime: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
    marginTop: 2,
  },
  slotTimeOn: {
    color: Colors.pink,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#343439',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: Colors.pink,
  },
  timePicker: {
    backgroundColor: '#15161C',
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  timeTitle: {
    color: Colors.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  timePreview: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 28,
    letterSpacing: -0.6,
  },
  wheelLabel: {
    color: Colors.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  wheel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tick: {
    width: 44,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#292A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickWide: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: '#292A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickOn: {
    backgroundColor: Colors.pink,
  },
  tickText: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 14,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  period: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#292A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodOn: {
    backgroundColor: Colors.pink,
  },
  periodText: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaBold,
    fontSize: 15,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1A1B20',
    borderRadius: 14,
    padding: 12,
  },
  noteText: {
    flex: 1,
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
  noteStrong: {
    color: Colors.snow,
    fontFamily: Fonts.jakartaSemi,
  },
  error: {
    color: '#FFB4AB',
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
});
