import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

type StatusBadgeTone = "success" | "warning" | "danger" | "neutral";

type StatusBadgeProps = {
  label: string;
  tone?: StatusBadgeTone;
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  const color = toneColor(tone);

  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

function toneColor(tone: StatusBadgeTone) {
  switch (tone) {
    case "success":
      return colors.success;
    case "warning":
      return colors.warning;
    case "danger":
      return colors.danger;
    case "neutral":
      return colors.muted;
  }
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  label: {
    fontSize: 12,
    fontWeight: "800"
  }
});
