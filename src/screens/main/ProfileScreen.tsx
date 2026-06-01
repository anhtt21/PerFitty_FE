import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Brain,
  CalendarDays,
  ChevronRight,
  Languages,
  Lock,
  LogOut,
  Menu,
  Moon,
  Pencil,
  Share2,
  Sun,
  X,
} from "lucide-react-native";
import {
  getProfile,
  getStylePreferences,
  resolveAvatarUrl,
  updateProfile,
  uploadProfileAvatar,
} from "../../services/profileApi";
import { useAuthStore } from "../../store/useAuthStore";
import { AppLanguage, useUiStore } from "../../store/useUiStore";
import { authThemes, AuthPalette } from "../../theme/authTheme";

const savedOutfits = [
  {
    titleVi: "Thứ Hai Tối Giản",
    titleEn: "Monochrome Monday",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80",
  },
  {
    titleVi: "Dạo Phòng Tranh",
    titleEn: "Gallery Opening",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
  },
  {
    titleVi: "Layer Thu Nhẹ",
    titleEn: "Autumn Layers",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
  },
  {
    titleVi: "Thanh Lịch Công Sở",
    titleEn: "Power Lunch",
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=600&q=80",
  },
];

const closeFriends = [
  { name: "Sarah", color: "#D98F8F" },
  { name: "Marcus", color: "#1F1F1F" },
  { name: "Elena", color: "#EADCCB" },
];

const copy = {
  vi: {
    editProfile: "Chỉnh sửa",
    sharePortfolio: "Chia sẻ hồ sơ",
    items: "Món đồ",
    outfits: "Bộ phối",
    rooms: "Phòng",
    styleProfile: "Hồ sơ phong cách",
    styleDescription:
      "Gu của bạn nghiêng về phom dáng tinh gọn, màu sắc hài hòa và các món đồ dễ ứng dụng mỗi ngày.",
    mostWornColors: "Màu hay dùng",
    closetInsights: "Gợi ý tủ đồ",
    sustainable: "Tối ưu & bền vững",
    costPerWear: "Chi phí mỗi lần mặc",
    mostWornItem: "Món mặc nhiều nhất",
    comingSoon: "Sắp có",
    savedOutfits: "Bộ phối đã lưu",
    viewAll: "Xem tất cả",
    closeFriends: "Bạn thân",
    notifications: "Thông báo",
    privacySettings: "Quyền riêng tư",
    aiPreferences: "Tùy chỉnh AI",
    settings: "Cài đặt",
    darkMode: "Chế độ tối",
    language: "Ngôn ngữ",
    vietnamese: "Tiếng Việt",
    english: "English",
    logout: "Đăng xuất",
    editTitle: "Chỉnh sửa trang cá nhân",
    fullName: "Họ tên",
    gender: "Giới tính",
    height: "Chiều cao",
    bodyShape: "Dáng người",
    save: "Lưu thay đổi",
    cancel: "Hủy",
    displayNameRequired: "Vui lòng nhập họ tên.",
    invalidHeight: "Chiều cao không hợp lệ.",
    updateSuccess: "Đã cập nhật trang cá nhân.",
    uploadSuccess: "Đã cập nhật ảnh đại diện.",
    genericError: "Không thể hoàn tất yêu cầu. Vui lòng thử lại.",
    photoPermissionDenied: "PerFitty cần quyền chọn ảnh để đổi ảnh đại diện.",
    shareTitle: "Hồ sơ PerFitty",
    shareMessage: "Xem hồ sơ PerFitty của tôi",
    shareCopied: "Đã sao chép liên kết hồ sơ.",
    loading: "Đang tải hồ sơ...",
    addFriend: "Thêm bạn",
  },
  en: {
    editProfile: "Edit Profile",
    sharePortfolio: "Share Portfolio",
    items: "Items",
    outfits: "Outfits",
    rooms: "Rooms",
    styleProfile: "Style Profile",
    styleDescription:
      "Your aesthetic leans toward clean silhouettes, balanced colors, and pieces that work across everyday moments.",
    mostWornColors: "Most Worn Colors",
    closetInsights: "Closet Insights",
    sustainable: "Sustainable & Efficient",
    costPerWear: "Cost Per Wear",
    mostWornItem: "Most Worn Item",
    comingSoon: "Coming soon",
    savedOutfits: "Saved Outfits",
    viewAll: "View All",
    closeFriends: "Close Friends",
    notifications: "Notifications",
    privacySettings: "Privacy Settings",
    aiPreferences: "AI Preferences",
    settings: "Settings",
    darkMode: "Dark Mode",
    language: "Language",
    vietnamese: "Tiếng Việt",
    english: "English",
    logout: "Logout",
    editTitle: "Edit Profile",
    fullName: "Full Name",
    gender: "Gender",
    height: "Height",
    bodyShape: "Body Shape",
    save: "Save Changes",
    cancel: "Cancel",
    displayNameRequired: "Please enter your full name.",
    invalidHeight: "Height is invalid.",
    updateSuccess: "Profile updated.",
    uploadSuccess: "Avatar updated.",
    genericError: "Could not complete the request. Please try again.",
    photoPermissionDenied:
      "PerFitty needs photo permission to update your avatar.",
    shareTitle: "PerFitty Profile",
    shareMessage: "View my PerFitty profile",
    shareCopied: "Profile link copied.",
    loading: "Loading profile...",
    addFriend: "Add friend",
  },
};

type EditFormState = {
  displayName: string;
  gender: string;
  heightCm: string;
  bodyShape: string;
};

export function ProfileScreen() {
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const colorMode = useUiStore((state) => state.colorMode);
  const setColorMode = useUiStore((state) => state.setColorMode);
  const language = useUiStore((state) => state.language);
  const setLanguage = useUiStore((state) => state.setLanguage);

  const palette = authThemes[colorMode];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const t = copy[language];

  const [editOpen, setEditOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<EditFormState>({
    displayName: "",
    gender: "",
    heightCm: "",
    bodyShape: "",
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { data: stylePreferences } = useQuery({
    queryKey: ["profile", "style-preferences"],
    queryFn: getStylePreferences,
  });

  const displayName =
    profile?.displayName ?? user?.displayName ?? "PerFitty User";
  const handle = user?.email ? `@${user.email.split("@")[0]}` : "@perfitty";
  const avatarUrl = resolveAvatarUrl(profile);

  useEffect(() => {
    setForm({
      displayName,
      gender: profile?.gender ?? "",
      heightCm: profile?.heightCm ? String(profile.heightCm) : "",
      bodyShape: profile?.bodyShape ?? "",
    });
  }, [displayName, profile?.bodyShape, profile?.gender, profile?.heightCm]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timer = setTimeout(() => setNotice(null), 3_000);
    return () => clearTimeout(timer);
  }, [notice]);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      setEditOpen(false);
      setNotice(t.updateSuccess);
    },
    onError() {
      setNotice(t.genericError);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadProfileAvatar,
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      setNotice(t.uploadSuccess);
    },
    onError() {
      setNotice(t.genericError);
    },
  });

  const styleLabel = toTitleLabel(
    stylePreferences?.preferredStyles?.[0] ?? "minimalist chic",
  );

  const favoriteColors = stylePreferences?.favoriteColors?.length
    ? stylePreferences.favoriteColors.slice(0, 3)
    : ["Charcoal", "Muted Rose", "Beige"];

  async function handlePickAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setNotice(t.photoPermissionDenied);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];

    uploadAvatarMutation.mutate({
      uri: asset.uri,
      fileName: asset.fileName,
      mimeType: asset.mimeType,
    });
  }

  function handleSaveProfile() {
    const nextDisplayName = form.displayName.trim();

    if (!nextDisplayName) {
      setNotice(t.displayNameRequired);
      return;
    }

    const heightValue = form.heightCm.trim()
      ? Number(form.heightCm.trim())
      : null;

    if (heightValue !== null && !Number.isFinite(heightValue)) {
      setNotice(t.invalidHeight);
      return;
    }

    updateProfileMutation.mutate({
      displayName: nextDisplayName,
      avatarObjectKey: profile?.avatarObjectKey ?? null,
      gender: emptyToNull(form.gender),
      heightCm: heightValue,
      bodyShape: emptyToNull(form.bodyShape),
    });
  }

  async function handleSharePortfolio() {
    const portfolioUrl = `https://perfitty.app/portfolio/${
      user?.id ?? profile?.userId ?? "me"
    }`;

    try {
      if (Platform.OS === "web") {
        const webNavigator = globalThis.navigator as
          | {
              share?: (data: {
                title?: string;
                text?: string;
                url?: string;
              }) => Promise<void>;
              clipboard?: {
                writeText: (text: string) => Promise<void>;
              };
            }
          | undefined;

        if (webNavigator?.share) {
          await webNavigator.share({
            title: t.shareTitle,
            text: `${t.shareMessage}: ${displayName}`,
            url: portfolioUrl,
          });
          return;
        }

        await webNavigator?.clipboard?.writeText(portfolioUrl);
        setNotice(t.shareCopied);
        return;
      }

      await Share.share({
        title: t.shareTitle,
        message: `${t.shareMessage}: ${displayName}\n${portfolioUrl}`,
        url: portfolioUrl,
      });
    } catch {
      setNotice(t.genericError);
    }
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton}>
          <Menu color={palette.primary} size={22} />
        </Pressable>

        <Text style={styles.brand}>PerFitty</Text>

        <Pressable style={styles.iconButton}>
          <CalendarDays color={palette.primary} size={20} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}

        <View style={styles.profileHero}>
          <Pressable
            disabled={uploadAvatarMutation.isPending}
            onPress={() => void handlePickAvatar()}
            style={styles.avatar}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{getInitial(displayName)}</Text>
            )}

            <View style={styles.editAvatarButton}>
              {uploadAvatarMutation.isPending ? (
                <ActivityIndicator color={palette.primaryText} size="small" />
              ) : (
                <Pencil color={palette.primaryText} size={16} />
              )}
            </View>
          </Pressable>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.handle}>{handle}</Text>

          {isProfileLoading ? (
            <Text style={styles.loadingText}>{t.loading}</Text>
          ) : null}

          <View style={styles.actionRow}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => setEditOpen(true)}
            >
              <Pencil color={palette.primaryText} size={15} />
              <Text style={styles.primaryButtonText}>{t.editProfile}</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => void handleSharePortfolio()}
            >
              <Share2 color={palette.muted} size={15} />
              <Text style={styles.secondaryButtonText}>{t.sharePortfolio}</Text>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <Stat value="0" label={t.items} styles={styles} />
            <Stat value="0" label={t.outfits} styles={styles} />
            <Stat value="0" label={t.rooms} styles={styles} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t.styleProfile}</Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{styleLabel}</Text>
            </View>
          </View>

          <Text style={styles.description}>{t.styleDescription}</Text>

          <Text style={styles.sectionLabel}>{t.mostWornColors}</Text>

          <View style={styles.colorRow}>
            {favoriteColors.map((color) => (
              <View key={color} style={styles.colorItem}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: getColorValue(color, palette) },
                  ]}
                />
                <Text style={styles.colorName}>{toTitleLabel(color)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>{t.closetInsights}</Text>
          <Text style={styles.insightSubtitle}>{t.sustainable}</Text>

          <Text style={styles.insightLabel}>{t.costPerWear}</Text>
          <Text style={styles.insightValue}>$0.00 avg</Text>

          <Text style={styles.insightLabel}>{t.mostWornItem}</Text>
          <Text style={styles.insightValue}>{t.comingSoon}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.inlineSectionTitle}>{t.savedOutfits}</Text>
          <Pressable>
            <Text style={styles.linkText}>{t.viewAll}</Text>
          </Pressable>
        </View>

        <View style={styles.outfitGrid}>
          {savedOutfits.map((outfit) => (
            <ImageBackground
              key={outfit.titleEn}
              source={{ uri: outfit.image }}
              imageStyle={styles.outfitImage}
              style={styles.outfitCard}
            >
              <View style={styles.outfitOverlay} />
              <Text style={styles.outfitTitle}>
                {language === "vi" ? outfit.titleVi : outfit.titleEn}
              </Text>
            </ImageBackground>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t.closeFriends}</Text>

        <View style={styles.friendRow}>
          {closeFriends.map((friend) => (
            <View key={friend.name} style={styles.friendItem}>
              <View
                style={[styles.friendAvatar, { backgroundColor: friend.color }]}
              >
                <Text style={styles.friendInitial}>
                  {getInitial(friend.name)}
                </Text>
              </View>
              <Text style={styles.friendName}>{friend.name}</Text>
            </View>
          ))}

          <Pressable style={styles.addFriendButton}>
            <Text style={styles.addFriendText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>{t.settings}</Text>

          <View style={styles.settingRow}>
            <View style={styles.menuLeft}>
              {colorMode === "dark" ? (
                <Moon color={palette.text} size={18} />
              ) : (
                <Sun color={palette.text} size={18} />
              )}
              <Text style={styles.menuLabel}>{t.darkMode}</Text>
            </View>

            <Switch
              onValueChange={(enabled) =>
                setColorMode(enabled ? "dark" : "light")
              }
              thumbColor={palette.elevated}
              trackColor={{
                false: palette.disabled,
                true: palette.primary,
              }}
              value={colorMode === "dark"}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.menuLeft}>
              <Languages color={palette.text} size={18} />
              <Text style={styles.menuLabel}>{t.language}</Text>
            </View>

            <View style={styles.languageTabs}>
              <LanguageButton
                active={language === "vi"}
                label="VI"
                onPress={() => setLanguage("vi")}
                styles={styles}
              />
              <LanguageButton
                active={language === "en"}
                label="EN"
                onPress={() => setLanguage("en")}
                styles={styles}
              />
            </View>
          </View>
        </View>

        <View style={styles.menuGroup}>
          <ProfileMenuItem
            icon={<Bell color={palette.text} size={18} />}
            label={t.notifications}
            styles={styles}
            palette={palette}
          />
          <ProfileMenuItem
            icon={<Lock color={palette.text} size={18} />}
            label={t.privacySettings}
            styles={styles}
            palette={palette}
          />
          <ProfileMenuItem
            icon={<Brain color={palette.text} size={18} />}
            label={t.aiPreferences}
            styles={styles}
            palette={palette}
          />

          <Pressable style={styles.logoutRow} onPress={() => void signOut()}>
            <LogOut color={palette.danger} size={18} />
            <Text style={styles.logoutText}>{t.logout}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <EditProfileModal
        form={form}
        isSaving={updateProfileMutation.isPending}
        onChange={setForm}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveProfile}
        palette={palette}
        styles={styles}
        t={t}
        visible={editOpen}
      />
    </View>
  );
}

function EditProfileModal({
  form,
  isSaving,
  onChange,
  onClose,
  onSave,
  palette,
  styles,
  t,
  visible,
}: {
  form: EditFormState;
  isSaving: boolean;
  onChange: (value: EditFormState) => void;
  onClose: () => void;
  onSave: () => void;
  palette: AuthPalette;
  styles: ReturnType<typeof createStyles>;
  t: (typeof copy)[AppLanguage];
  visible: boolean;
}) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.editTitle}</Text>

            <Pressable style={styles.modalCloseButton} onPress={onClose}>
              <X color={palette.text} size={20} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <ProfileInput
              label={t.fullName}
              onChangeText={(displayName) => onChange({ ...form, displayName })}
              styles={styles}
              value={form.displayName}
            />

            <ProfileInput
              label={t.gender}
              onChangeText={(gender) => onChange({ ...form, gender })}
              placeholder="female / male / other"
              styles={styles}
              value={form.gender}
            />

            <ProfileInput
              keyboardType="numeric"
              label={`${t.height} (cm)`}
              onChangeText={(heightCm) => onChange({ ...form, heightCm })}
              styles={styles}
              value={form.heightCm}
            />

            <ProfileInput
              label={t.bodyShape}
              onChangeText={(bodyShape) => onChange({ ...form, bodyShape })}
              placeholder="pear / hourglass / rectangle"
              styles={styles}
              value={form.bodyShape}
            />

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </Pressable>

              <Pressable
                disabled={isSaving}
                style={styles.saveButton}
                onPress={onSave}
              >
                {isSaving ? (
                  <ActivityIndicator color={palette.primaryText} size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>{t.save}</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function ProfileInput({
  keyboardType,
  label,
  onChangeText,
  placeholder,
  styles,
  value,
}: {
  keyboardType?: "default" | "numeric";
  label: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  styles: ReturnType<typeof createStyles>;
  value: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

function Stat({
  value,
  label,
  styles,
}: {
  value: string;
  label: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ProfileMenuItem({
  icon,
  label,
  styles,
  palette,
}: {
  icon: React.ReactNode;
  label: string;
  styles: ReturnType<typeof createStyles>;
  palette: AuthPalette;
}) {
  return (
    <Pressable style={styles.menuRow}>
      <View style={styles.menuLeft}>
        {icon}
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <ChevronRight color={palette.muted} size={18} />
    </Pressable>
  );
}

function LanguageButton({
  active,
  label,
  onPress,
  styles,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable
      style={[styles.languageButton, active && styles.languageButtonActive]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.languageButtonText,
          active && styles.languageButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function getInitial(value: string) {
  return value.trim().charAt(0).toUpperCase() || "P";
}

function emptyToNull(value: string) {
  return value.trim() ? value.trim() : null;
}

function toTitleLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getColorValue(color: string, palette: AuthPalette) {
  const normalized = color.toLowerCase();

  if (normalized.includes("rose")) return "#D98F8F";
  if (normalized.includes("beige")) return "#EADCCB";
  if (normalized.includes("black") || normalized.includes("charcoal"))
    return "#1F1F1F";
  if (normalized.includes("white")) return "#FFFDF9";
  if (normalized.includes("red")) return "#B84A4A";
  if (normalized.includes("blue")) return "#5F7896";

  return palette.primary;
}

function colorWithAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const red = parseInt(value.substring(0, 2), 16);
  const green = parseInt(value.substring(2, 4), 16);
  const blue = parseInt(value.substring(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function createStyles(palette: AuthPalette) {
  return StyleSheet.create({
    root: {
      backgroundColor: palette.background,
      flex: 1,
    },
    header: {
      alignItems: "center",
      borderBottomColor: palette.divider,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      height: 56,
      paddingHorizontal: 16,
    },
    iconButton: {
      alignItems: "center",
      height: 40,
      justifyContent: "center",
      width: 40,
    },
    brand: {
      color: palette.primary,
      flex: 1,
      fontSize: 24,
      fontWeight: "900",
      marginLeft: 4,
    },
    content: {
      paddingBottom: 28,
    },
    notice: {
      color: palette.danger,
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 19,
      paddingHorizontal: 20,
      paddingTop: 12,
      textAlign: "center",
    },
    profileHero: {
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: 20,
    },
    avatar: {
      alignItems: "center",
      backgroundColor: palette.secondary,
      borderColor: palette.elevated,
      borderRadius: 46,
      borderWidth: 4,
      height: 92,
      justifyContent: "center",
      shadowColor: palette.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 16,
      width: 92,
    },
    avatarImage: {
      borderRadius: 42,
      height: 84,
      width: 84,
    },
    avatarText: {
      color: palette.primary,
      fontSize: 38,
      fontWeight: "900",
    },
    editAvatarButton: {
      alignItems: "center",
      backgroundColor: palette.primary,
      borderColor: palette.elevated,
      borderRadius: 18,
      borderWidth: 2,
      bottom: -4,
      height: 36,
      justifyContent: "center",
      position: "absolute",
      right: -6,
      width: 36,
    },
    name: {
      color: palette.text,
      fontSize: 22,
      fontWeight: "800",
      marginTop: 18,
    },
    handle: {
      color: palette.muted,
      fontSize: 14,
      marginTop: 4,
    },
    loadingText: {
      color: palette.muted,
      fontSize: 12,
      marginTop: 8,
    },
    actionRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 14,
    },
    primaryButton: {
      alignItems: "center",
      backgroundColor: palette.primary,
      borderRadius: 999,
      flexDirection: "row",
      gap: 7,
      height: 36,
      justifyContent: "center",
      paddingHorizontal: 18,
    },
    primaryButtonText: {
      color: palette.primaryText,
      fontSize: 13,
      fontWeight: "800",
    },
    secondaryButton: {
      alignItems: "center",
      backgroundColor: palette.secondary,
      borderRadius: 999,
      flexDirection: "row",
      gap: 7,
      height: 36,
      justifyContent: "center",
      paddingHorizontal: 18,
    },
    secondaryButtonText: {
      color: palette.muted,
      fontSize: 13,
      fontWeight: "700",
    },
    statsRow: {
      borderTopColor: palette.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      paddingTop: 14,
      width: "100%",
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      color: palette.text,
      fontSize: 14,
      fontWeight: "800",
    },
    statLabel: {
      color: palette.muted,
      fontSize: 11,
      marginTop: 2,
    },
    card: {
      backgroundColor: palette.elevated,
      borderRadius: 8,
      marginHorizontal: 16,
      marginTop: 28,
      padding: 22,
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
    pill: {
      backgroundColor: palette.secondary,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    pillText: {
      color: palette.primary,
      fontSize: 11,
      fontWeight: "800",
    },
    description: {
      color: palette.text,
      fontSize: 14,
      lineHeight: 21,
      marginTop: 14,
    },
    sectionLabel: {
      color: palette.text,
      fontSize: 11,
      fontWeight: "900",
      marginTop: 20,
      textTransform: "uppercase",
    },
    colorRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      marginTop: 12,
    },
    colorItem: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },
    colorDot: {
      borderRadius: 12,
      height: 24,
      width: 24,
    },
    colorName: {
      color: palette.text,
      fontSize: 12,
      fontWeight: "600",
    },
    insightCard: {
      backgroundColor: colorWithAlpha(palette.tertiary, 0.12),
      borderColor: colorWithAlpha(palette.tertiary, 0.35),
      borderRadius: 8,
      borderWidth: 1,
      marginHorizontal: 16,
      marginTop: 14,
      padding: 22,
    },
    insightTitle: {
      color: palette.primary,
      fontSize: 16,
      fontWeight: "800",
    },
    insightSubtitle: {
      color: palette.danger,
      fontSize: 13,
      marginTop: 10,
    },
    insightLabel: {
      color: palette.danger,
      fontSize: 11,
      fontWeight: "900",
      marginTop: 14,
      textTransform: "uppercase",
    },
    insightValue: {
      color: palette.text,
      fontSize: 13,
      marginTop: 3,
    },
    sectionHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 16,
      marginTop: 28,
    },
    inlineSectionTitle: {
      color: palette.text,
      fontSize: 15,
      fontWeight: "800",
    },
    sectionTitle: {
      color: palette.text,
      fontSize: 15,
      fontWeight: "800",
      marginHorizontal: 16,
      marginTop: 24,
    },
    linkText: {
      color: palette.primary,
      fontSize: 13,
      fontWeight: "700",
    },
    outfitGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginHorizontal: 16,
      marginTop: 12,
    },
    outfitCard: {
      height: 150,
      justifyContent: "flex-end",
      overflow: "hidden",
      width: "48%",
    },
    outfitImage: {
      borderRadius: 8,
    },
    outfitOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.28)",
      borderRadius: 8,
    },
    outfitTitle: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "800",
      padding: 12,
    },
    friendRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 14,
      marginHorizontal: 16,
      marginTop: 12,
    },
    friendItem: {
      alignItems: "center",
      gap: 6,
    },
    friendAvatar: {
      alignItems: "center",
      borderColor: palette.elevated,
      borderRadius: 24,
      borderWidth: 2,
      height: 48,
      justifyContent: "center",
      width: 48,
    },
    friendInitial: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "900",
    },
    friendName: {
      color: palette.text,
      fontSize: 11,
      fontWeight: "600",
    },
    addFriendButton: {
      alignItems: "center",
      borderColor: palette.border,
      borderRadius: 24,
      borderStyle: "dashed",
      borderWidth: 1,
      height: 48,
      justifyContent: "center",
      width: 48,
    },
    addFriendText: {
      color: palette.primary,
      fontSize: 24,
      fontWeight: "300",
    },
    settingsCard: {
      backgroundColor: palette.elevated,
      borderRadius: 8,
      gap: 10,
      marginHorizontal: 16,
      marginTop: 24,
      padding: 16,
    },
    settingRow: {
      alignItems: "center",
      borderTopColor: palette.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: 52,
      paddingTop: 10,
    },
    languageTabs: {
      backgroundColor: palette.background,
      borderRadius: 999,
      flexDirection: "row",
      padding: 3,
    },
    languageButton: {
      alignItems: "center",
      borderRadius: 999,
      height: 32,
      justifyContent: "center",
      minWidth: 44,
      paddingHorizontal: 12,
    },
    languageButtonActive: {
      backgroundColor: palette.primary,
    },
    languageButtonText: {
      color: palette.muted,
      fontSize: 12,
      fontWeight: "800",
    },
    languageButtonTextActive: {
      color: palette.primaryText,
    },
    menuGroup: {
      gap: 8,
      marginHorizontal: 16,
      marginTop: 12,
    },
    menuRow: {
      alignItems: "center",
      backgroundColor: palette.surface,
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: 52,
      paddingHorizontal: 16,
    },
    menuLeft: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
    },
    menuLabel: {
      color: palette.text,
      fontSize: 14,
      fontWeight: "600",
    },
    logoutRow: {
      alignItems: "center",
      backgroundColor: colorWithAlpha(palette.danger, 0.08),
      borderRadius: 8,
      flexDirection: "row",
      gap: 12,
      minHeight: 52,
      paddingHorizontal: 16,
    },
    logoutText: {
      color: palette.danger,
      fontSize: 14,
      fontWeight: "800",
    },
    modalBackdrop: {
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.36)",
      flex: 1,
      justifyContent: "flex-end",
    },
    modalCard: {
      backgroundColor: palette.surface,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      maxHeight: "88%",
      padding: 20,
      width: "100%",
    },
    modalHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    modalTitle: {
      color: palette.text,
      fontSize: 20,
      fontWeight: "900",
    },
    modalCloseButton: {
      alignItems: "center",
      height: 36,
      justifyContent: "center",
      width: 36,
    },
    inputGroup: {
      gap: 8,
      marginBottom: 14,
    },
    inputLabel: {
      color: palette.text,
      fontSize: 13,
      fontWeight: "800",
    },
    input: {
      backgroundColor: palette.input,
      borderColor: palette.border,
      borderRadius: 8,
      borderWidth: 1,
      color: palette.inputText,
      fontSize: 15,
      minHeight: 50,
      paddingHorizontal: 14,
    },
    placeholder: {
      color: palette.muted,
    },
    modalActions: {
      flexDirection: "row",
      gap: 10,
      marginTop: 8,
    },
    cancelButton: {
      alignItems: "center",
      backgroundColor: palette.secondary,
      borderRadius: 8,
      flex: 1,
      height: 48,
      justifyContent: "center",
    },
    cancelButtonText: {
      color: palette.primary,
      fontSize: 14,
      fontWeight: "800",
    },
    saveButton: {
      alignItems: "center",
      backgroundColor: palette.primary,
      borderRadius: 8,
      flex: 1,
      height: 48,
      justifyContent: "center",
    },
    saveButtonText: {
      color: palette.primaryText,
      fontSize: 14,
      fontWeight: "900",
    },
  });
}
