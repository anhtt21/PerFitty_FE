import { useState } from "react";
import { Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Lock, Mail, User } from "lucide-react-native";
import {
  getAuthErrorMessage,
  register,
} from "../../services/authApi";
import { AuthStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/useAuthStore";
import { useUiStore } from "../../store/useUiStore";
import { authThemes } from "../../theme/authTheme";
import { useI18n } from "../../i18n";
import { buildAuthErrorMessages } from "../../i18n/authErrorMessages";
import {
  AuthButton,
  AuthError,
  AuthFooterLink,
  AuthScaffold,
  AuthTextField,
  SocialRow,
} from "./components/AuthUi";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

type RegisterErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function RegisterScreen({ navigation }: Props) {
  const { language, t } = useI18n();
  const colorMode = useUiStore((state) => state.colorMode);
  const toggleColorMode = useUiStore((state) => state.toggleColorMode);
  const toggleLanguage = useUiStore((state) => state.toggleLanguage);
  const setSession = useAuthStore((state) => state.setSession);

  const palette = authThemes[colorMode];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    const nextErrors = validateRegister(
      fullName,
      email,
      password,
      confirmPassword,
      t,
    );
    setErrors(nextErrors);
    setFormError(undefined);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        email,
        password,
        displayName: fullName,
        deviceId: "perfitty-mobile",
        deviceName: Platform.OS,
      });

      await setSession(
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
        response.user,
      );
    } catch (error) {
      setFormError(getAuthErrorMessage(error, buildAuthErrorMessages(t)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScaffold
      palette={palette}
      brand={t("brand")}
      title={t("registerTitle")}
      subtitle={t("registerSubtitle")}
      languageLabel={language}
      isDark={colorMode === "dark"}
      onToggleLanguage={toggleLanguage}
      onToggleTheme={toggleColorMode}
    >
      <AuthTextField
        palette={palette}
        label={t("fullName")}
        placeholder={t("fullNamePlaceholder")}
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
        icon={<User size={18} color={palette.muted} />}
      />

      <AuthTextField
        palette={palette}
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        icon={<Mail size={18} color={palette.muted} />}
      />

      <AuthTextField
        palette={palette}
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        icon={<Lock size={18} color={palette.muted} />}
      />

      <AuthTextField
        palette={palette}
        label={t("confirmPassword")}
        placeholder={t("passwordPlaceholder")}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
        icon={<Lock size={18} color={palette.muted} />}
      />

      <AuthError palette={palette} message={formError} />

      <AuthButton
        palette={palette}
        label={t("signUp")}
        loading={loading}
        onPress={handleRegister}
      />

      <SocialRow
        palette={palette}
        dividerLabel={t("orContinueWith")}
        appleLabel={t("apple")}
        googleLabel={t("google")}
      />

      <AuthFooterLink
        palette={palette}
        text={t("haveAccount")}
        action={t("goLogin")}
        onPress={() => navigation.navigate("Login")}
      />
    </AuthScaffold>
  );
}

function validateRegister(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
  t: (key: any) => string,
) {
  const errors: RegisterErrors = {};

  if (!fullName.trim()) {
    errors.fullName = t("requiredName");
  }

  if (!email.trim()) {
    errors.email = t("requiredEmail");
  }

  if (!password) {
    errors.password = t("requiredPassword");
  } else if (password.length < 8) {
    errors.password = t("passwordMin");
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = t("passwordMismatch");
  }

  return errors;
}
