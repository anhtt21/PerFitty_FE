import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { TextInput } from "../../components/ui/TextInput";
import { Screen } from "../../components/layout/Screen";
import { AuthStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/useAuthStore";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const openAppShell = useAuthStore((state) => state.openAppShell);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.brand}>PerFitty</Text>
        <Text style={styles.subtitle}>Your wardrobe, outfits, and friend feedback in one place.</Text>
      </View>

      <Card>
        <TextInput label="Email" autoCapitalize="none" keyboardType="email-address" />
        <TextInput label="Password" secureTextEntry />
        <Button label="Sign in" fullWidth onPress={openAppShell} />
        <Button
          label="Create account"
          fullWidth
          variant="ghost"
          onPress={() => navigation.navigate("Register")}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.ink,
    fontSize: typography.title,
    fontWeight: "900"
  },
  header: {
    gap: spacing.sm,
    paddingTop: spacing.xl
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24
  }
});
