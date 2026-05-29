import { Image, ImageStyle, StyleProp } from "react-native";
import perfittyLogo from "../../../assets/perfitty-logo.png";

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
      source={perfittyLogo}
      style={[{ height: size, width: size }, style]}
    />
  );
}
