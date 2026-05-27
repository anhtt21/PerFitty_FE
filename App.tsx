import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { AppProviders } from "./src/providers/AppProviders";
import { useUiStore } from "./src/store/useUiStore";
import { authThemes } from "./src/theme/authTheme";

export default function App() {
  const colorMode = useUiStore((state) => state.colorMode);
  const palette = authThemes[colorMode];

  useEffect(() => {
    if (Platform.OS === "web") {
      document.title = "PerFitty";
    }
  }, []);

  return (
    <AppProviders>
      <View
        style={[
          styles.host,
          Platform.OS === "web" ? { backgroundColor: palette.secondary } : null,
        ]}
      >
        <View
          style={[
            styles.phoneFrame,
            Platform.OS === "web"
              ? {
                  backgroundColor: palette.background,
                  borderColor: palette.border,
                  shadowColor: palette.shadow,
                }
              : null,
          ]}
        >
          <StatusBar style={colorMode === "dark" ? "light" : "dark"} />
          <RootNavigator />
        </View>
      </View>
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  host: {
    alignItems: Platform.OS === "web" ? "center" : "stretch",
    flex: 1,
  },
  phoneFrame: {
    borderLeftWidth: Platform.OS === "web" ? 1 : 0,
    borderRightWidth: Platform.OS === "web" ? 1 : 0,
    flex: 1,
    maxWidth: Platform.OS === "web" ? 430 : undefined,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: Platform.OS === "web" ? 0.14 : 0,
    shadowRadius: 28,
    width: "100%",
  },
});
