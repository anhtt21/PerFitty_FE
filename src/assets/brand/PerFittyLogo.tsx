import { Image, ImageStyle, StyleProp } from "react-native";

type PerFittyLogoProps = {
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function PerFittyLogo({ size = 40, style }: PerFittyLogoProps) {
  return (
    <Image
      accessibilityIgnoresInvertColors
      accessibilityLabel="PerFitty logo"
      resizeMode="contain"
      source={require("../../../assets/perfitty-logo.png")}
      style={[{ height: size, width: size }, style]}
    />
  );
}
