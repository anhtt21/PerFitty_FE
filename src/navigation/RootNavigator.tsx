import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator } from "./AuthNavigator";
import { MainTabs } from "./MainTabs";
import { useAuthStore } from "../store/useAuthStore";

export function RootNavigator() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  return (
    <NavigationContainer>
      {isSignedIn ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
