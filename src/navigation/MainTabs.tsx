import { CalendarDays, Home, PlusCircle, Shirt, UserRound } from "lucide-react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "./types";
import { CalendarScreen } from "../screens/main/CalendarScreen";
import { CreateOutfitScreen } from "../screens/main/CreateOutfitScreen";
import { HomeScreen } from "../screens/main/HomeScreen";
import { ProfileScreen } from "../screens/main/ProfileScreen";
import { WardrobeScreen } from "../screens/main/WardrobeScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator<MainTabParamList>();

function tabIcon(routeName: keyof MainTabParamList, color: string, size: number) {
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopColor: colors.line,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarIcon: ({ color, size }) => tabIcon(route.name, color, size)
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
