import { RefreshCw } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { LoadingSkeleton } from "../../components/ui/LoadingSkeleton";
import { Screen } from "../../components/layout/Screen";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useApiHealth } from "../../hooks/useApiHealth";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export function HomeScreen() {
  const apiHealth = useApiHealth();
  const health = apiHealth.data?.data;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.subtitle}>Plan an outfit, check your closet, or ask friends before heading out.</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>API status</Text>
        {apiHealth.isLoading ? (
          <LoadingSkeleton height={24} width="60%" />
        ) : (
          <StatusBadge
            label={health?.status ?? "Offline"}
            tone={health?.status === "Healthy" ? "success" : "danger"}
          />
        )}
        <Button
          label="Refresh"
          variant="secondary"
          icon={<RefreshCw color={colors.primary} size={18} />}
          onPress={() => apiHealth.refetch()}
        />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Next core flow</Text>
        <Text style={styles.body}>Add wardrobe items, create outfits, and save them to your calendar.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 23
  },
  cardTitle: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: "800"
  },
  header: {
    gap: spacing.sm
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24
  },
  title: {
    color: colors.ink,
    fontSize: typography.title,
    fontWeight: "900"
  }
});
