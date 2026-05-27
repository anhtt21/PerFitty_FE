import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text } from "react-native";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Screen } from "../../components/layout/Screen";
import { TextInput } from "../../components/ui/TextInput";
import { AuthStackParamList } from "../../navigation/types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  return (
    <Screen>
      <Text style={styles.title}>Create your PerFitty account</Text>
      <Card>
        <TextInput label="Name" />
        <TextInput label="Email" autoCapitalize="none" keyboardType="email-address" />
        <TextInput label="Password" secureTextEntry />
        <Button label="Continue" fullWidth onPress={() => navigation.navigate("OnboardingStyle")} />
        <Button label="Back to sign in" fullWidth variant="ghost" onPress={() => navigation.goBack()} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: typography.heading,
    fontWeight: "900"
  }
});
