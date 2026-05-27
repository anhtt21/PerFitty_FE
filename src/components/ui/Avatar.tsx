import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

type AvatarProps = {
  name: string;
  size?: number;
};

export function Avatar({ name, size = 44 }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "P";

  return (
    <View style={[styles.avatar, { height: size, width: size, borderRadius: size / 2 }]}>
      <Text style={styles.text}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: colors.mint,
    justifyContent: "center"
  },
  text: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800"
  }
});
