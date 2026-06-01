import {
  CalendarDays,
  Home,
  PlusCircle,
  Shirt,
  UserRound,
} from "lucide-react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "./types";
import { CalendarScreen } from "../screens/main/CalendarScreen";
import { CreateOutfitScreen } from "../screens/main/CreateOutfitScreen";
import { HomeScreen } from "../screens/main/HomeScreen";
import { ProfileScreen } from "../screens/main/ProfileScreen";
import { WardrobeScreen } from "../screens/main/WardrobeScreen";
import { useUiStore } from "../store/useUiStore";
import { authThemes } from "../theme/authTheme";

const Tab = createBottomTabNavigator<MainTabParamList>();

function tabIcon(
  routeName: keyof MainTabParamList,
  color: string,
  size: number,
) {
  const props = { color, size, strokeWidth: 2 };

  switch (routeName) {
    case "Home":
      return <Home {...props} />;
    case "Wardrobe":
      return <Shirt {...props} />;
    case "Create":
      return <PlusCircle {...props} />;
    case "Calendar":
      return <CalendarDays {...props} />;
    case "Profile":
      return <UserRound {...props} />;
  }
}

export function MainTabs() {
  const colorMode = useUiStore((state) => state.colorMode);
  const palette = authThemes[colorMode];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.divider,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size }) => tabIcon(route.name, color, size),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="Create" component={CreateOutfitScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
