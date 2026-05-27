import { Plus } from "lucide-react-native";
import { StyleSheet, Text } from "react-native";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Screen } from "../../components/layout/Screen";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export function CreateOutfitScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Create outfit</Text>
      <EmptyState
        title="Start from wardrobe items"
        message="Outfit builder will combine selected tops, bottoms, shoes, and accessories."
        action={
          <Button
            label="New outfit"
            icon={<Plus color={colors.primaryText} size={18} />}
            disabled
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: typography.title,
    fontWeight: "900"
  }
});
