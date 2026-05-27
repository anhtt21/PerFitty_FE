import { useState } from "react";
import { Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Lock, Mail } from "lucide-react-native";
import {
  getAuthErrorMessage,
  getCurrentUser,
  login,
} from "../../services/authApi";
import { AuthStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/useAuthStore";
import { useUiStore } from "../../store/useUiStore";
import { authThemes } from "../../theme/authTheme";
import { TranslationKey, useI18n } from "../../i18n";
import { buildAuthErrorMessages } from "../../i18n/authErrorMessages";
import {
  AuthButton,
  AuthError,
  AuthFooterLink,
  AuthScaffold,
  AuthTextField,
  SocialRow,
} from "./components/AuthUi";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

type LoginErrors = {
  email?: string;
  password?: string;
};

export function LoginScreen({ navigation }: Props) {
  const { language, t } = useI18n();
  const colorMode = useUiStore((state) => state.colorMode);
  const toggleColorMode = useUiStore((state) => state.toggleColorMode);
  const toggleLanguage = useUiStore((state) => state.toggleLanguage);
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);

  const palette = authThemes[colorMode];

  const [email, setEmail] = useState("test@perfitty.local");
  const [password, setPassword] = useState("Password123!");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const nextErrors = validateLogin(email, password, t);
    setErrors(nextErrors);
    setFormError(undefined);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        email,
        password,
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

      const me = await getCurrentUser();
      setUser(me);
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
      title={t("loginTitle")}
      subtitle={t("loginSubtitle")}
      languageLabel={language}
      isDark={colorMode === "dark"}
      onToggleLanguage={toggleLanguage}
      onToggleTheme={toggleColorMode}
    >
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

      <AuthError palette={palette} message={formError} />

      <AuthButton
        palette={palette}
        label={t("login")}
        loading={loading}
        onPress={handleLogin}
      />

      <SocialRow
        palette={palette}
        dividerLabel={t("orContinueWith")}
        appleLabel={t("apple")}
        googleLabel={t("google")}
      />

      <AuthFooterLink
        palette={palette}
        text={t("noAccount")}
        action={t("goSignUp")}
        onPress={() => navigation.navigate("Register")}
      />
    </AuthScaffold>
  );
}

function validateLogin(
  email: string,
  password: string,
  t: (key: TranslationKey) => string,
) {
  const errors: LoginErrors = {};

  if (!email.trim()) {
    errors.email = t("requiredEmail");
  }

  if (!password) {
    errors.password = t("requiredPassword");
  }

  return errors;
}
