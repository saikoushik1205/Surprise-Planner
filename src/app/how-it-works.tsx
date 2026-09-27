import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Pill } from '@/components/fit';
import { Colors, Fonts } from '@/constants/theme';
import { HOW_IT_LANDS } from '@/data/missions';

export default function HowItWorksScreen() {
  return (
    <AppFrame>
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>How it works</Text>
        <Text style={styles.title}>How the mission lands</Text>
        <View style={styles.grid}>
          {HOW_IT_LANDS.map((step) => (
            <View key={step.step} style={styles.card}>
              <Text style={styles.step}>{step.step}</Text>
              <Text style={styles.cardTitle}>{step.title}</Text>
              <Text style={styles.body} numberOfLines={3}>
                {step.body}
              </Text>
            </View>
          ))}
        </View>
        <Pill label="Build your surprise" onPress={() => router.push('/book/target')} />
      </View>
    </AppFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 10,
    paddingBottom: 8,
  },
  eyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.snow,
    fontFamily: Fonts.display,
    fontSize: 26,
    lineHeight: 30,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.panel,
    padding: 12,
    justifyContent: 'center',
    gap: 4,
  },
  step: {
    color: Colors.pink,
    fontFamily: Fonts.ui,
    fontSize: 12,
  },
  cardTitle: {
    color: Colors.snow,
    fontFamily: Fonts.display,
    fontSize: 16,
  },
  body: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
});
