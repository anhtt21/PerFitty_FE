import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { AuthNavigator } from "./AuthNavigator";
import { MainTabs } from "./MainTabs";
import { PerFittyLogo } from "../assets/brand/PerFittyLogo";
import { OnboardingStyleScreen } from "../screens/auth/OnboardingStyleScreen";
import { getStylePreferences } from "../services/profileApi";
import { useAuthStore } from "../store/useAuthStore";
import { useUiStore } from "../store/useUiStore";
import { authThemes } from "../theme/authTheme";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

export function RootNavigator() {
  const status = useAuthStore((state) => state.status);
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const bootstrapAuth = useAuthStore((state) => state.bootstrapAuth);

  useEffect(() => {
    void bootstrapAuth();
  }, [bootstrapAuth]);

  return (
    <NavigationContainer>
      {status === "checking" ? (
        <AuthBootstrapScreen />
      ) : isSignedIn ? (
        <AuthenticatedFlow />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

function AuthenticatedFlow() {
  const styleQuery = useQuery({
    queryKey: ["profile", "style-preferences"],
    queryFn: getStylePreferences,
  });

  if (styleQuery.isLoading) {
    return <AuthBootstrapScreen />;
  }

  const preferences = styleQuery.data;
  const hasCompletedOnboarding =
    Boolean(preferences?.preferredStyles?.length) &&
    Boolean(preferences?.preferredOccasions?.length);

  return hasCompletedOnboarding ? <MainTabs /> : <OnboardingStyleScreen />;
}

function AuthBootstrapScreen() {
  const colorMode = useUiStore((state) => state.colorMode);
  const palette = authThemes[colorMode];

  return (
    <View
      style={[styles.loadingScreen, { backgroundColor: palette.background }]}
    >
      <PerFittyLogo size={64} />
      <ActivityIndicator color={palette.primary} size="large" />
      <Text style={[styles.loadingText, { color: palette.muted }]}>
        PerFitty
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
  },
  loadingText: {
    fontSize: typography.heading,
    fontWeight: "900",
  },
});
