import { ReactNode, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Apple,
  Chrome,
  Eye,
  EyeOff,
  Languages,
  Moon,
  Sun,
} from "lucide-react-native";
import { PerFittyLogo } from "../../../assets/brand/PerFittyLogo";
import { AuthPalette } from "../../../theme/authTheme";
import { spacing } from "../../../theme/spacing";

type AuthScaffoldProps = {
  palette: AuthPalette;
  brand: string;
  title: string;
  subtitle: string;
  languageLabel: string;
  isDark: boolean;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  children: ReactNode;
};

export function AuthScaffold({
  palette,
  brand,
  title,
  subtitle,
  languageLabel,
  isDark,
  onToggleLanguage,
  onToggleTheme,
  children,
}: AuthScaffoldProps) {
  const styles = createStyles(palette);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.topBar}>
            <View style={styles.brandLockup}>
              <PerFittyLogo size={42} />
              <Text style={styles.brand}>{brand}</Text>
            </View>

            <View style={styles.toggleRow}>
              <IconToggle
                palette={palette}
                label={languageLabel.toUpperCase()}
                icon={<Languages size={16} color={palette.text} />}
                onPress={onToggleLanguage}
              />
              <IconToggle
                palette={palette}
                label=""
                icon={
                  isDark ? (
                    <Sun size={16} color={palette.text} />
                  ) : (
                    <Moon size={16} color={palette.text} />
                  )
                }
                onPress={onToggleTheme}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type AuthTextFieldProps = TextInputProps & {
  palette: AuthPalette;
  label: string;
  icon?: ReactNode;
  error?: string;
};

export function AuthTextField({
  palette,
  label,
  icon,
  error,
  secureTextEntry,
  style,
  ...props
}: AuthTextFieldProps) {
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const styles = createStyles(palette);
  const webInputReset =
    Platform.OS === "web"
      ? ({ outlineStyle: "none" } as unknown as TextStyle)
      : null;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error ? styles.inputWrapError : null]}>
        {icon}
        <RNTextInput
          placeholderTextColor={palette.muted}
          secureTextEntry={secureTextEntry ? hidden : false}
          style={[styles.input, webInputReset, style]}
          {...props}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setHidden((value) => !value)}
            hitSlop={10}
          >
            {hidden ? (
              <Eye size={18} color={palette.muted} />
            ) : (
              <EyeOff size={18} color={palette.muted} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

type AuthButtonProps = {
  palette: AuthPalette;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function AuthButton({
  palette,
  label,
  loading,
  disabled,
  onPress,
}: AuthButtonProps) {
  const styles = createStyles(palette);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        pressed ? { backgroundColor: palette.primaryPressed } : null,
        disabled ? { backgroundColor: palette.disabled } : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.primaryText} />
      ) : (
        <Text style={styles.primaryButtonText}>{label}</Text>
      )}
    </Pressable>
  );
}

type AuthFooterLinkProps = {
  palette: AuthPalette;
  text: string;
  action: string;
  onPress: () => void;
};

export function AuthFooterLink({
  palette,
  text,
  action,
  onPress,
}: AuthFooterLinkProps) {
  const styles = createStyles(palette);

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{text} </Text>
      <Pressable onPress={onPress}>
        <Text style={styles.footerAction}>{action}</Text>
      </Pressable>
    </View>
  );
}

type SocialRowProps = {
  palette: AuthPalette;
  dividerLabel: string;
  appleLabel: string;
  googleLabel: string;
};

export function SocialRow({
  palette,
  dividerLabel,
  appleLabel,
  googleLabel,
}: SocialRowProps) {
  const styles = createStyles(palette);

  return (
    <View style={styles.socialSection}>
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>{dividerLabel}</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialRow}>
        <SocialButton
          palette={palette}
          label={appleLabel}
          icon={<Apple size={15} color={palette.text} />}
        />
        <SocialButton
          palette={palette}
          label={googleLabel}
          icon={<Chrome size={15} color={palette.text} />}
        />
      </View>
    </View>
  );
}

export function AuthError({
  palette,
  message,
}: {
  palette: AuthPalette;
  message?: string;
}) {
  const styles = createStyles(palette);

  if (!message) {
    return null;
  }

  return <Text style={styles.formError}>{message}</Text>;
}

function SocialButton({
  palette,
  label,
  icon,
}: {
  palette: AuthPalette;
  label: string;
  icon: ReactNode;
}) {
  const styles = createStyles(palette);

  return (
    <Pressable disabled style={styles.socialButton}>
      {icon}
      <Text style={styles.socialButtonText}>{label}</Text>
    </Pressable>
  );
}

function IconToggle({
  palette,
  label,
  icon,
  onPress,
}: {
  palette: AuthPalette;
  label: string;
  icon: ReactNode;
  onPress: () => void;
}) {
  const styles = createStyles(palette);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.iconToggle}
    >
      {icon}
      {label ? <Text style={styles.iconToggleText}>{label}</Text> : null}
    </Pressable>
  );
}

function createStyles(palette: AuthPalette) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: palette.background,
    },
    keyboard: {
      flex: 1,
    },
    scroll: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 28,
    },
    topBar: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.lg,
    },
    brand: {
      color: palette.primary,
      fontSize: 26,
      fontWeight: "900",
    },
    brandLockup: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing.sm,
    },
    toggleRow: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    iconToggle: {
      alignItems: "center",
      backgroundColor: palette.elevated,
      borderColor: palette.border,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      gap: spacing.xs,
      minHeight: 36,
      paddingHorizontal: 12,
    },
    iconToggleText: {
      color: palette.text,
      fontSize: 12,
      fontWeight: "800",
    },
    card: {
      backgroundColor: palette.surface,
      borderColor: palette.border,
      borderRadius: 8,
      borderWidth: 1,
      gap: 18,
      paddingHorizontal: 30,
      paddingVertical: 34,
      shadowColor: palette.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 18 },
      elevation: 5,
    },
    title: {
      color: palette.text,
      fontSize: 30,
      fontWeight: "900",
      lineHeight: 36,
      textAlign: "center",
    },
    subtitle: {
      color: palette.muted,
      fontSize: 16,
      lineHeight: 23,
      textAlign: "center",
    },
    field: {
      gap: spacing.xs,
    },
    label: {
      color: palette.text,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 0,
    },
    inputWrap: {
      alignItems: "center",
      backgroundColor: palette.input,
      borderColor: palette.border,
      borderRadius: 14,
      borderWidth: 1,
      flexDirection: "row",
      gap: spacing.sm,
      minHeight: 60,
      paddingHorizontal: 16,
    },
    inputWrapError: {
      borderColor: palette.danger,
    },
    input: {
      color: palette.inputText,
      flex: 1,
      fontSize: 16,
      minHeight: 58,
      paddingVertical: 0,
    },
    error: {
      color: palette.danger,
      fontSize: 12,
    },
    formError: {
      color: palette.danger,
      fontSize: 13,
      lineHeight: 20,
      textAlign: "center",
    },
    primaryButton: {
      alignItems: "center",
      backgroundColor: palette.primary,
      borderRadius: 10,
      minHeight: 62,
      justifyContent: "center",
      marginTop: 4,
      paddingHorizontal: spacing.lg,
    },
    primaryButtonText: {
      color: palette.primaryText,
      fontSize: 16,
      fontWeight: "900",
    },
    socialSection: {
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    dividerRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: spacing.sm,
    },
    divider: {
      backgroundColor: palette.divider,
      flex: 1,
      height: 1,
    },
    dividerText: {
      color: palette.muted,
      fontSize: 12,
      fontWeight: "700",
    },
    socialRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    socialButton: {
      alignItems: "center",
      backgroundColor: palette.elevated,
      borderColor: palette.border,
      borderRadius: 10,
      borderWidth: 1,
      flex: 1,
      flexDirection: "row",
      gap: spacing.sm,
      justifyContent: "center",
      minHeight: 54,
      opacity: 0.7,
    },
    socialButtonText: {
      color: palette.text,
      fontSize: 13,
      fontWeight: "800",
    },
    footer: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: spacing.sm,
    },
    footerText: {
      color: palette.muted,
      fontSize: 13,
    },
    footerAction: {
      color: palette.primary,
      fontSize: 13,
      fontWeight: "900",
    },
  });
}
