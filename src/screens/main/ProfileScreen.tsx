import { LogOut } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Screen } from "../../components/layout/Screen";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuthStore } from "../../store/useAuthStore";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export function ProfileScreen() {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>
      <Card>
        <View style={styles.profileRow}>
          <Avatar name="PerFitty User" />
          <View style={styles.profileText}>
            <Text style={styles.name}>PerFitty User</Text>
            <StatusBadge label="MVP setup" tone="success" />
          </View>
        </View>
        <Button
          label="Sign out"
          variant="ghost"
          icon={<LogOut color={colors.ink} size={18} />}
          onPress={signOut}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: "900"
  },
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  profileText: {
    flex: 1,
    gap: spacing.xs
  },
  title: {
    color: colors.ink,
    fontSize: typography.title,
    fontWeight: "900"
  }
});
