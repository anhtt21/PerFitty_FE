import { ReactNode } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from "react-native";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = Omit<PressableProps, "style"> & {
  label: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = "primary",
  icon,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const palette = getPalette(variant, disabled);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          opacity: pressed ? 0.82 : 1
        },
        style
      ]}
      {...props}
    >
      <View style={styles.content}>
        {icon}
        <Text style={[styles.label, { color: palette.text }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function getPalette(variant: ButtonVariant, disabled?: boolean | null) {
  if (disabled) {
    return {
      background: colors.skeleton,
      border: colors.skeleton,
      text: colors.muted
    };
  }

  if (variant === "secondary") {
    return {
      background: colors.mint,
      border: colors.mint,
      text: colors.primary
    };
  }

  if (variant === "ghost") {
    return {
      background: "transparent",
      border: colors.line,
      text: colors.ink
    };
  }

  return {
    background: colors.primary,
    border: colors.primary,
    text: colors.primaryText
  };
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center"
  },
  fullWidth: {
    width: "100%"
  },
  label: {
    fontSize: 16,
    fontWeight: "700"
  }
});
