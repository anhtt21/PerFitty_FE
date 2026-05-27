import { ColorMode } from "../store/useUiStore";

export type AuthPalette = {
  background: string;
  surface: string;
  elevated: string;
  text: string;
  muted: string;
  primary: string;
  primaryPressed: string;
  primaryText: string;
  secondary: string;
  tertiary: string;
  border: string;
  input: string;
  inputText: string;
  danger: string;
  divider: string;
  disabled: string;
  shadow: string;
};

export const authThemes: Record<ColorMode, AuthPalette> = {
  light: {
    background: "#F7F2ED",
    surface: "#FFFDF9",
    elevated: "#FFFFFF",
    text: "#211D1D",
    muted: "#8A7A78",
    primary: "#9B5558",
    primaryPressed: "#88484B",
    primaryText: "#FFFFFF",
    secondary: "#EADCCB",
    tertiary: "#FF8A7A",
    border: "#E8D8D4",
    input: "#FFFDFC",
    inputText: "#211D1D",
    danger: "#B84A4A",
    divider: "#E9DDD7",
    disabled: "#E9DEDA",
    shadow: "#9B5558",
  },
  dark: {
    background: "#1F1F1F",
    surface: "#292424",
    elevated: "#332B2B",
    text: "#FFF6F1",
    muted: "#C9B8B2",
    primary: "#D98F8F",
    primaryPressed: "#C97C7C",
    primaryText: "#1F1F1F",
    secondary: "#6E5950",
    tertiary: "#FF8A7A",
    border: "#4A3C3C",
    input: "#241F1F",
    inputText: "#FFF6F1",
    danger: "#FF9A8F",
    divider: "#443838",
    disabled: "#3B3333",
    shadow: "#000000",
  },
};
