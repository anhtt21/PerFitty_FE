import { StyleSheet, Text, TextInput as RNTextInput, TextInputProps, View } from "react-native";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

type AppTextInputProps = TextInputProps & {
  label: string;
  error?: string;
};

export function TextInput({ label, error, style, ...props }: AppTextInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <RNTextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, error && styles.inputError, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs
  },
  error: {
    color: colors.danger,
    fontSize: 13
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md
  },
  inputError: {
    borderColor: colors.danger
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700"
  }
});
