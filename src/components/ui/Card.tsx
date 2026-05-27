import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

export function Card({ children, style, ...props }: PropsWithChildren<ViewProps>) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  }
});
