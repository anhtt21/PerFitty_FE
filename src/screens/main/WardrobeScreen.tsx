import { useState } from "react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../../components/ui/EmptyState";
import { ImagePickerButton } from "../../components/ui/ImagePickerButton";
import { Screen } from "../../components/layout/Screen";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useUiStore } from "../../store/useUiStore";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

const categories = ["All", "Tops", "Bottoms", "Shoes", "Bags"];

export function WardrobeScreen() {
  const [pickedAsset, setPickedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const selectedCategory = useUiStore((state) => state.selectedWardrobeCategory);
  const setSelectedCategory = useUiStore((state) => state.setSelectedWardrobeCategory);

  return (
    <Screen>
      <Text style={styles.title}>Wardrobe</Text>
      <View style={styles.filters}>
        {categories.map((category) => (
          <Text
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[styles.filter, selectedCategory === category && styles.filterActive]}
          >
            {category}
          </Text>
        ))}
      </View>

      {pickedAsset ? (
        <View style={styles.preview}>
          <Image source={{ uri: pickedAsset.uri }} style={styles.previewImage} contentFit="cover" />
          <View style={styles.previewMeta}>
            <StatusBadge label="Ready to tag" tone="success" />
            <Text style={styles.previewText}>Image selected. Metadata form comes with wardrobe CRUD.</Text>
          </View>
        </View>
      ) : (
        <EmptyState
          title="Your closet is ready"
          message="Add the first item image to start building a wardrobe grid."
          action={<ImagePickerButton label="Add item image" onPicked={setPickedAsset} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filter: {
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  filterActive: {
    backgroundColor: colors.mint,
    borderColor: colors.primary,
    color: colors.primary
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  preview: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden"
  },
  previewImage: {
    aspectRatio: 1,
    width: "100%"
  },
  previewMeta: {
    gap: spacing.sm,
    padding: spacing.lg
  },
  previewText: {
    color: colors.muted,
    fontSize: typography.body
  },
  title: {
    color: colors.ink,
    fontSize: typography.title,
    fontWeight: "900"
  }
});
