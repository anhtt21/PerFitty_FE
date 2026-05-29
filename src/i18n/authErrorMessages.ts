import { AuthErrorMessages } from "../services/authApi";
import { TranslationKey } from "./index";

export function buildAuthErrorMessages(
  t: (key: TranslationKey) => string,
): AuthErrorMessages {
  return {
    fallback: t("authError"),
    network: t("networkError"),
    timeout: t("timeoutError"),
    invalidRegisterRequest: t("invalidRegisterRequest"),
    weakPassword: t("weakPassword"),
    emailAlreadyExists: t("emailAlreadyExists"),
    invalidCredentials: t("invalidCredentials"),
    accountDisabled: t("accountDisabled"),
    invalidRefreshToken: t("invalidRefreshToken"),
    invalidAccessToken: t("invalidAccessToken"),
    userNotFound: t("userNotFound"),
    databaseUnavailable: t("databaseUnavailable"),
    serverError: t("serverError"),
  };
}
