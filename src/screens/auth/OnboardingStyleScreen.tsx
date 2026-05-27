import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Screen } from "../../components/layout/Screen";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { AuthStackParamList } from "../../navigation/types";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

const styles = ["Minimal", "Streetwear", "Korean", "Office", "Casual"];

type Props = NativeStackScreenProps<AuthStackParamList, "OnboardingStyle">;

export function OnboardingStyleScreen({ navigation }: Props) {
  return (
    <Screen>
      <Text style={screenStyles.title}>Choose your style lane</Text>
      <Card>
        <View style={screenStyles.chips}>
          {styles.map((style) => (
            <StatusBadge key={style} label={style} tone="neutral" />
          ))}
        </View>
        <Button
          label="Back to login"
          fullWidth
          onPress={() => navigation.navigate("Login")}
        />
      </Card>
    </Screen>
  );
}

const screenStyles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: typography.heading,
    fontWeight: "900",
  },
});
