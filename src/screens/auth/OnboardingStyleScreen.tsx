import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Screen } from "../../components/layout/Screen";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuthStore } from "../../store/useAuthStore";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

const styles = ["Minimal", "Streetwear", "Korean", "Office", "Casual"];

export function OnboardingStyleScreen() {
  const openAppShell = useAuthStore((state) => state.openAppShell);

  return (
    <Screen>
      <Text style={screenStyles.title}>Choose your style lane</Text>
      <Card>
        <View style={screenStyles.chips}>
          {styles.map((style) => (
            <StatusBadge key={style} label={style} tone="neutral" />
          ))}
        </View>
        <Button label="Finish setup" fullWidth onPress={openAppShell} />
      </Card>
    </Screen>
  );
}

const screenStyles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  title: {
    color: colors.ink,
    fontSize: typography.heading,
    fontWeight: "900"
  }
});
