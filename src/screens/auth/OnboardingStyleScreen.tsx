import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Sparkles } from "lucide-react-native";
import { PerFittyLogo } from "../../assets/brand/PerFittyLogo";
import { updateStylePreferences } from "../../services/profileApi";
import { useUiStore } from "../../store/useUiStore";
import { authThemes, AuthPalette } from "../../theme/authTheme";

const styleOptions = [
  { value: "basic", vi: "Cơ bản", en: "Basic" },
  { value: "minimalist", vi: "Tối giản", en: "Minimalist" },
  { value: "korean", vi: "Hàn Quốc", en: "Korean" },
  { value: "streetwear", vi: "Streetwear", en: "Streetwear" },
  { value: "vintage", vi: "Vintage", en: "Vintage" },
  { value: "feminine", vi: "Nữ tính", en: "Feminine" },
  { value: "formal", vi: "Thanh lịch", en: "Formal" },
  { value: "sporty", vi: "Năng động", en: "Sporty" },
  { value: "y2k", vi: "Y2K", en: "Y2K" },
  { value: "casual", vi: "Thường ngày", en: "Casual" },
];

const occasionOptions = [
  { value: "school", vi: "Đi học", en: "School" },
  { value: "work", vi: "Đi làm", en: "Work" },
  { value: "hangout", vi: "Đi chơi", en: "Hangout" },
  { value: "date", vi: "Hẹn hò", en: "Date" },
  { value: "interview", vi: "Phỏng vấn", en: "Interview" },
  { value: "travel", vi: "Du lịch", en: "Travel" },
  { value: "party", vi: "Dự tiệc", en: "Party" },
  { value: "home", vi: "Ở nhà", en: "Home" },
];

const colorOptions = [
  { value: "black", label: "Black", color: "#1F1F1F" },
  { value: "white", label: "White", color: "#F8F4EF" },
  { value: "beige", label: "Beige", color: "#EADCCB" },
  { value: "brown", label: "Brown", color: "#7B5D4B" },
  { value: "blue", label: "Blue", color: "#5B7193" },
  { value: "pink", label: "Pink", color: "#D98F8F" },
  { value: "green", label: "Green", color: "#6F8066" },
  { value: "red", label: "Red", color: "#B95050" },
];

export function OnboardingStyleScreen() {
  const queryClient = useQueryClient();
  const colorMode = useUiStore((state) => state.colorMode);
  const language = useUiStore((state) => state.language);
  const palette = authThemes[colorMode];
  const styles = useMemo(() => createStyles(palette), [palette]);

  const [preferredStyles, setPreferredStyles] = useState<string[]>([]);
  const [preferredOccasions, setPreferredOccasions] = useState<string[]>([]);
  const [favoriteColors, setFavoriteColors] = useState<string[]>([]);
  const [avoidedColors, setAvoidedColors] = useState<string[]>([]);
  const [formError, setFormError] = useState<string>();

  const copy =
    language === "vi"
      ? {
          title: "Chọn gu của bạn",
          subtitle: "PerFitty sẽ dùng thông tin này để gợi ý outfit hợp hơn.",
          styleTitle: "Style Profile",
          styleHint: "Chọn đúng 3 phong cách bạn thích nhất.",
          occasionTitle: "Dịp bạn hay mặc",
          colorTitle: "Màu bạn thích",
          avoidTitle: "Màu nên tránh",
          button: "Hoàn tất",
          saving: "Đang lưu...",
          needStyle: "Hãy chọn đúng 3 phong cách yêu thích.",
          needOccasion: "Hãy chọn ít nhất 1 dịp thường mặc.",
          failed: "Không thể lưu style profile. Vui lòng thử lại.",
          insightTitle: "Closet Insight",
          insightBody:
            "Gu của bạn sẽ giúp PerFitty lọc item, màu sắc và outfit trước khi gợi ý.",
        }
      : {
          title: "Choose your style",
          subtitle:
            "PerFitty will use this to make outfit suggestions feel personal.",
          styleTitle: "Style Profile",
          styleHint: "Pick exactly 3 styles you like most.",
          occasionTitle: "Occasions",
          colorTitle: "Favorite colors",
          avoidTitle: "Colors to avoid",
          button: "Finish",
          saving: "Saving...",
          needStyle: "Please pick exactly 3 favorite styles.",
          needOccasion: "Please pick at least 1 occasion.",
          failed: "Could not save your style profile. Please try again.",
          insightTitle: "Closet Insight",
          insightBody:
            "Your taste helps PerFitty filter items, colors, and outfits before suggesting.",
        };

  const saveMutation = useMutation({
    mutationFn: updateStylePreferences,
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["profile", "style-preferences"],
      });
    },
    onError() {
      setFormError(copy.failed);
    },
  });

  function toggleValue(
    value: string,
    values: string[],
    setValues: (next: string[]) => void,
    max?: number,
  ) {
    setFormError(undefined);

    if (values.includes(value)) {
      setValues(values.filter((item) => item !== value));
      return;
    }

    if (max && values.length >= max) {
      return;
    }

    setValues([...values, value]);
  }

  function handleSubmit() {
    setFormError(undefined);

    if (preferredStyles.length !== 3) {
      setFormError(copy.needStyle);
      return;
    }

    if (preferredOccasions.length < 1) {
      setFormError(copy.needOccasion);
      return;
    }

    saveMutation.mutate({
      preferredStyles,
      preferredOccasions,
      favoriteColors,
      avoidedColors,
    });
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <PerFittyLogo size={52} />
        <View style={styles.headerText}>
          <Text style={styles.brand}>PerFitty</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Sparkles size={36} color={palette.primary} />
        </View>
        <Text style={styles.title}>{copy.title}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{copy.styleTitle}</Text>
          <Text style={styles.counter}>{preferredStyles.length}/3</Text>
        </View>
        <Text style={styles.helper}>{copy.styleHint}</Text>
        <View style={styles.chipGrid}>
          {styleOptions.map((option) => (
            <Chip
              key={option.value}
              label={language === "vi" ? option.vi : option.en}
              selected={preferredStyles.includes(option.value)}
              palette={palette}
              onPress={() =>
                toggleValue(
                  option.value,
                  preferredStyles,
                  setPreferredStyles,
                  3,
                )
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{copy.occasionTitle}</Text>
        <View style={styles.chipGrid}>
          {occasionOptions.map((option) => (
            <Chip
              key={option.value}
              label={language === "vi" ? option.vi : option.en}
              selected={preferredOccasions.includes(option.value)}
              palette={palette}
              onPress={() =>
                toggleValue(
                  option.value,
                  preferredOccasions,
                  setPreferredOccasions,
                )
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{copy.colorTitle}</Text>
        <View style={styles.colorGrid}>
          {colorOptions.map((option) => (
            <ColorChip
              key={option.value}
              label={option.label}
              color={option.color}
              selected={favoriteColors.includes(option.value)}
              palette={palette}
              onPress={() =>
                toggleValue(option.value, favoriteColors, setFavoriteColors)
              }
            />
          ))}
        </View>

        <Text style={[styles.cardTitle, styles.sectionSpacing]}>
          {copy.avoidTitle}
        </Text>
        <View style={styles.colorGrid}>
          {colorOptions.map((option) => (
            <ColorChip
              key={option.value}
              label={option.label}
              color={option.color}
              selected={avoidedColors.includes(option.value)}
              palette={palette}
              onPress={() =>
                toggleValue(option.value, avoidedColors, setAvoidedColors)
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>{copy.insightTitle}</Text>
        <Text style={styles.insightBody}>{copy.insightBody}</Text>
      </View>

      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <Pressable
        disabled={saveMutation.isPending}
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.button,
          pressed ? { backgroundColor: palette.primaryPressed } : null,
          saveMutation.isPending ? { backgroundColor: palette.disabled } : null,
        ]}
      >
        {saveMutation.isPending ? (
          <ActivityIndicator color={palette.primaryText} />
        ) : (
          <Text style={styles.buttonText}>{copy.button}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

function Chip({
  label,
  selected,
  palette,
  onPress,
}: {
  label: string;
  selected: boolean;
  palette: AuthPalette;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        chipStyles.chip,
        {
          backgroundColor: selected ? palette.primary : palette.elevated,
          borderColor: selected ? palette.primary : palette.border,
        },
      ]}
    >
      <Text
        style={[
          chipStyles.chipText,
          { color: selected ? palette.primaryText : palette.text },
        ]}
      >
        {label}
      </Text>
      {selected ? <Check size={14} color={palette.primaryText} /> : null}
    </Pressable>
  );
}

function ColorChip({
  label,
  color,
  selected,
  palette,
  onPress,
}: {
  label: string;
  color: string;
  selected: boolean;
  palette: AuthPalette;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        chipStyles.colorChip,
        {
          borderColor: selected ? palette.primary : palette.border,
          backgroundColor: palette.elevated,
        },
      ]}
    >
      <View style={[chipStyles.swatch, { backgroundColor: color }]} />
      <Text style={[chipStyles.colorText, { color: palette.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function createStyles(palette: AuthPalette) {
  return StyleSheet.create({
    screen: {
      backgroundColor: palette.background,
      flex: 1,
    },
    content: {
      gap: 18,
      paddingHorizontal: 20,
      paddingBottom: 36,
      paddingTop: 22,
    },
    header: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
    },
    headerText: {
      flex: 1,
    },
    brand: {
      color: palette.primary,
      fontSize: 24,
      fontWeight: "900",
    },
    subtitle: {
      color: palette.muted,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 2,
    },
    hero: {
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
    },
    avatar: {
      alignItems: "center",
      backgroundColor: palette.surface,
      borderColor: palette.border,
      borderRadius: 44,
      borderWidth: 1,
      height: 88,
      justifyContent: "center",
      shadowColor: palette.shadow,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.14,
      shadowRadius: 20,
      width: 88,
    },
    title: {
      color: palette.text,
      fontSize: 28,
      fontWeight: "900",
      textAlign: "center",
    },
    card: {
      backgroundColor: palette.surface,
      borderColor: palette.border,
      borderRadius: 18,
      borderWidth: 1,
      gap: 12,
      padding: 20,
      shadowColor: palette.shadow,
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
    },
    cardHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cardTitle: {
      color: palette.text,
      fontSize: 15,
      fontWeight: "800",
    },
    counter: {
      color: palette.primary,
      fontSize: 13,
      fontWeight: "900",
    },
    helper: {
      color: palette.muted,
      fontSize: 13,
      lineHeight: 19,
    },
    chipGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    colorGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    sectionSpacing: {
      marginTop: 8,
    },
    insightCard: {
      backgroundColor: colorModeAwareTint(palette),
      borderColor: palette.tertiary,
      borderRadius: 18,
      borderWidth: 1,
      gap: 8,
      padding: 20,
    },
    insightTitle: {
      color: palette.primary,
      fontSize: 15,
      fontWeight: "900",
    },
    insightBody: {
      color: palette.text,
      fontSize: 13,
      lineHeight: 20,
    },
    error: {
      color: palette.danger,
      fontSize: 13,
      lineHeight: 20,
      textAlign: "center",
    },
    button: {
      alignItems: "center",
      backgroundColor: palette.primary,
      borderRadius: 12,
      minHeight: 58,
      justifyContent: "center",
    },
    buttonText: {
      color: palette.primaryText,
      fontSize: 16,
      fontWeight: "900",
    },
  });
}

function colorModeAwareTint(palette: AuthPalette) {
  return palette.primaryText === "#FFFFFF" ? "#FCE8E5" : "#3A2928";
}

const chipStyles = StyleSheet.create({
  chip: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    minHeight: 38,
    paddingHorizontal: 14,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "800",
  },
  colorChip: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    minHeight: 38,
    paddingHorizontal: 12,
  },
  colorText: {
    fontSize: 12,
    fontWeight: "800",
  },
  swatch: {
    borderRadius: 999,
    height: 18,
    width: 18,
  },
});
