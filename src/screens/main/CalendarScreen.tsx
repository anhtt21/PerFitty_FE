import { StyleSheet, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Screen } from "../../components/layout/Screen";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Calendar</Text>
      <Card>
        <View style={styles.week}>
          {days.map((day) => (
            <View key={day} style={styles.day}>
              <Text style={styles.dayText}>{day}</Text>
            </View>
          ))}
        </View>
      </Card>
      <EmptyState
        title="No outfits planned"
        message="Calendar scheduling starts after outfits can be saved."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  day: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: colors.mint,
    borderRadius: 8,
    justifyContent: "center",
    width: 40
  },
  dayText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900"
  },
  title: {
    color: colors.ink,
    fontSize: typography.title,
    fontWeight: "900"
  },
  week: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  }
});
