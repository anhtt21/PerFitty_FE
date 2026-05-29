import { useUiStore } from "../store/useUiStore";

const translations = {
  en: {
    brand: "PerFitty",
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in to experience PerFitty right now.",
    registerTitle: "Create New Account",
    registerSubtitle: "",
    fullName: "Full Name",
    fullNamePlaceholder: "Nguyễn Văn A",
    email: "Email",
    emailPlaceholder: "hello@style.com",
    password: "Password",
    passwordPlaceholder: "Your password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    login: "Log In",
    signUp: "Sign Up",
    orContinueWith: "or continue with",
    apple: "Apple",
    google: "Google",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    goSignUp: "Sign up",
    goLogin: "Log in",
    requiredName: "Name is required.",
    requiredEmail: "Email is required.",
    invalidEmail: "Email is invalid.",
    requiredPassword: "Password is required.",
    passwordMin: "Password must be at least 8 characters.",
    passwordMismatch: "Passwords do not match.",
    authError: "Could not complete the request. Please try again.",
    networkError:
      "Cannot connect to PerFitty API. Please start the backend and try again.",
    timeoutError:
      "The backend or database is taking too long. Please check the API and SQL Server.",
    databaseUnavailable:
      "Database is not running. Please start SQL Server, then try again.",
    serverError:
      "The server hit an error. Please check that the backend and database are running.",
    invalidRegisterRequest: "Please enter email and password.",
    weakPassword: "Password must be at least 8 characters.",
    emailAlreadyExists: "This email is already registered.",
    invalidCredentials: "Email or password is incorrect.",
    accountDisabled: "This account has been disabled.",
    invalidRefreshToken: "Your session has expired. Please log in again.",
    invalidAccessToken: "Your session is invalid. Please log in again.",
    userNotFound: "User account was not found.",
    languageToggle: "Change language",
    themeToggle: "Change theme",
  },
  vi: {
    brand: "PerFitty",
    loginTitle: "Chào mừng trở lại",
    loginSubtitle: "Đăng nhập để trải nghiệm PerFitty ngay lúc này.",
    registerTitle: "Tạo tài khoản mới",
    registerSubtitle: "",
    fullName: "Họ tên",
    fullNamePlaceholder: "Nguyễn Văn A",
    email: "Email",
    emailPlaceholder: "hello@style.com",
    password: "Mật khẩu",
    passwordPlaceholder: "Mật khẩu của bạn",
    confirmPassword: "Xác nhận mật khẩu",
    forgotPassword: "Quên mật khẩu?",
    login: "Đăng nhập",
    signUp: "Đăng ký",
    orContinueWith: "hoặc tiếp tục với",
    apple: "Apple",
    google: "Google",
    noAccount: "Chưa có tài khoản?",
    haveAccount: "Đã có tài khoản?",
    goSignUp: "Đăng ký",
    goLogin: "Đăng nhập",
    requiredName: "Vui lòng nhập họ tên.",
    requiredEmail: "Vui lòng nhập email.",
    invalidEmail: "Email không hợp lệ.",
    requiredPassword: "Vui lòng nhập mật khẩu.",
    passwordMin: "Mật khẩu cần ít nhất 8 ký tự.",
    passwordMismatch: "Mật khẩu xác nhận không khớp.",
    authError: "Không thể hoàn tất yêu cầu. Vui lòng thử lại.",
    networkError:
      "Không kết nối được PerFitty API. Hãy chạy backend rồi thử lại.",
    timeoutError:
      "Backend hoặc database phản hồi quá lâu. Hãy kiểm tra API và SQL Server.",
    databaseUnavailable:
      "Database chưa chạy. Hãy bật SQL Server rồi thử lại.",
    serverError:
      "Máy chủ đang lỗi. Hãy kiểm tra backend và database đã chạy chưa.",
    invalidRegisterRequest: "Vui lòng nhập email và mật khẩu.",
    weakPassword: "Mật khẩu cần ít nhất 8 ký tự.",
    emailAlreadyExists: "Email này đã được đăng ký.",
    invalidCredentials: "Email hoặc mật khẩu không đúng.",
    accountDisabled: "Tài khoản này đã bị vô hiệu hóa.",
    invalidRefreshToken: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    invalidAccessToken: "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.",
    userNotFound: "Không tìm thấy tài khoản người dùng.",
    languageToggle: "Đổi ngôn ngữ",
    themeToggle: "Đổi giao diện",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function useI18n() {
  const language = useUiStore((state) => state.language);
  const dictionary = translations[language] as Record<TranslationKey, string>;

  return {
    language,
    t(key: TranslationKey) {
      return dictionary[key];
    },
  };
}
