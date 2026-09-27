import { Tabs } from 'expo-router';
import { Bell, ClipboardList, House, Sparkles, UserRound } from 'lucide-react-native';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CrewColors, CrewFonts } from '@/constants/crewTheme';

type CrewTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const ICONS: Record<string, (color: string, size: number) => ReactNode> = {
  index: (c, s) => <House color={c} size={s} />,
  tasks: (c, s) => <ClipboardList color={c} size={s} />,
  surprises: (c, s) => <Sparkles color={c} size={s} />,
  alerts: (c, s) => <Bell color={c} size={s} />,
  profile: (c, s) => <UserRound color={c} size={s} />,
};

export function BottomTabBar({ state, descriptors, navigation }: CrewTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const color = focused ? CrewColors.pink : CrewColors.muted;

        function onPress() {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            onPress={onPress}
            style={styles.tab}>
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              {(ICONS[route.name] ?? ICONS.index)(color, 22)}
            </View>
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: CrewColors.card,
    borderTopWidth: 1,
    borderTopColor: 'rgba(124,58,237,0.2)',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255,45,120,0.12)',
  },
  label: {
    fontFamily: CrewFonts.bodySemi,
    fontSize: 10,
    lineHeight: 14,
  },
});
