import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { OnboardingStyleScreen } from "../screens/auth/OnboardingStyleScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OnboardingStyle" component={OnboardingStyleScreen} />
    </Stack.Navigator>
  );
}
