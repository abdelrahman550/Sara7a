import { LanguageEnum } from "../enum/index.js";

export const VALIDATION_CODES = {
  EMAIL_REQUIRED: 1001,
  EMAIL_INVALID: 1002,

  PASSWORD_REQUIRED: 1003,
  PASSWORD_INVALID: 1004,
  PASSWORD_WEAK: 1017,
  PASSWORD_MISMATCH: 1016,

  USERNAME_REQUIRED: 1007,
  USERNAME_INVALID: 1008,
  USERNAME_FULL_NAME: 1015,

  PHONE_REQUIRED: 1009,
  PHONE_INVALID: 1010,

  GENDER_REQUIRED: 1011,
  GENDER_INVALID: 1012,

  FIELDS_MISMATCH: 1014,

  OTP_REQUIRED: 1018,
  OTP_INVALID: 1019,
  OTP_FORMAT: 1020,
};

export const validationMessages = {
  [VALIDATION_CODES.EMAIL_REQUIRED]: {
    [LanguageEnum.EN]: "Email address is required.",
    [LanguageEnum.AR]: "البريد الإلكتروني مطلوب.",
  },
  [VALIDATION_CODES.EMAIL_INVALID]: {
    [LanguageEnum.EN]: "Please enter a valid email address.",
    [LanguageEnum.AR]: "يرجى إدخال بريد إلكتروني صحيح.",
  },

  [VALIDATION_CODES.PASSWORD_REQUIRED]: {
    [LanguageEnum.EN]: "Password is required.",
    [LanguageEnum.AR]: "كلمة المرور مطلوبة.",
  },
  [VALIDATION_CODES.PASSWORD_INVALID]: {
    [LanguageEnum.EN]: "Password must be a valid text value.",
    [LanguageEnum.AR]: "يجب أن تكون كلمة المرور نصًا صالحًا.",
  },
  [VALIDATION_CODES.PASSWORD_WEAK]: {
    [LanguageEnum.EN]:
      "Password must be 8 to 64 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (# ? ! @ $ % ^ & * -).",
    [LanguageEnum.AR]:
      "يجب أن تتكون كلمة المرور من 8 إلى 64 حرفًا، وأن تحتوي على الأقل على حرف إنجليزي كبير، وحرف إنجليزي صغير، ورقم، ورمز خاص واحد من: \u2066# ? ! @ $ % ^ & * -\u2069",
  },
  [VALIDATION_CODES.PASSWORD_MISMATCH]: {
    [LanguageEnum.EN]: "Passwords do not match.",
    [LanguageEnum.AR]: "كلمتا المرور غير متطابقتين.",
  },

  [VALIDATION_CODES.USERNAME_REQUIRED]: {
    [LanguageEnum.EN]: "Username is required.",
    [LanguageEnum.AR]: "اسم المستخدم مطلوب.",
  },
  [VALIDATION_CODES.USERNAME_INVALID]: {
    [LanguageEnum.EN]: "Username must be a valid text value.",
    [LanguageEnum.AR]: "يجب أن يكون اسم المستخدم نصًا صالحًا.",
  },
  [VALIDATION_CODES.USERNAME_FULL_NAME]: {
    [LanguageEnum.EN]: "Username must contain your first and last name.",
    [LanguageEnum.AR]: "يجب أن يحتوي اسم المستخدم على الاسم الأول والأخير.",
  },

  [VALIDATION_CODES.PHONE_REQUIRED]: {
    [LanguageEnum.EN]: "Phone number is required.",
    [LanguageEnum.AR]: "رقم الهاتف مطلوب.",
  },
  [VALIDATION_CODES.PHONE_INVALID]: {
    [LanguageEnum.EN]:
      "Please enter a valid phone number in international format (e.g. +201012345678).",
    [LanguageEnum.AR]:
      "يرجى إدخال رقم هاتف صحيح بالصيغة الدولية، مثل: \u2066+201012345678\u2069",
  },

  [VALIDATION_CODES.GENDER_REQUIRED]: {
    [LanguageEnum.EN]: "Gender is required.",
    [LanguageEnum.AR]: "الجنس مطلوب.",
  },
  [VALIDATION_CODES.GENDER_INVALID]: {
    [LanguageEnum.EN]: "Gender must be either 0 (Male) or 1 (Female).",
    [LanguageEnum.AR]: "يجب أن يكون الجنس إما 0 (ذكر) أو 1 (أنثى).",
  },

  [VALIDATION_CODES.FIELDS_MISMATCH]: {
    [LanguageEnum.EN]: "{original} and {copy} must match.",
    [LanguageEnum.AR]: "يجب أن يتطابق {original} مع {copy}.",
  },

  [VALIDATION_CODES.OTP_REQUIRED]: {
    [LanguageEnum.EN]: "Verification code is required.",
    [LanguageEnum.AR]: "رمز التحقق مطلوب.",
  },
  [VALIDATION_CODES.OTP_INVALID]: {
    [LanguageEnum.EN]: "Verification code must be a valid text value.",
    [LanguageEnum.AR]: "يجب أن يكون رمز التحقق نصًا صالحًا.",
  },
  [VALIDATION_CODES.OTP_FORMAT]: {
    [LanguageEnum.EN]: "Verification code must be exactly 6 digits.",
    [LanguageEnum.AR]: "يجب أن يتكون رمز التحقق من 6 أرقام بالضبط.",
  },
};

export const getValidationMessage = (
  code,
  lang = LanguageEnum.EN,
  params = {},
) => {
  const entry = validationMessages[code];
  if (!entry) return "Invalid value.";

  const template = entry[lang] ?? entry[LanguageEnum.EN];
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
};
