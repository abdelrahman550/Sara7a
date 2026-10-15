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

  MESSAGE_CONTENT_REQUIRED: 1021,
  MESSAGE_CONTENT_INVALID: 1022,
  MESSAGE_CONTENT_MIN: 1023,
  MESSAGE_CONTENT_MAX: 1024,

  ID_REQUIRED: 1025,
  ID_INVALID: 1026,

  FILES_INVALID: 1027,
  FILES_MAX: 1028,
  FILE_INVALID: 1029,

  MESSAGE_EMPTY: 1030,

  MESSAGE_TYPE_INVALID: 1031,

  REVEAL_DECISION_INVALID: 1032,
  REVEAL_STATUS_INVALID: 1033,

  FIRST_NAME_INVALID: 1034,
  LAST_NAME_INVALID: 1035,
  DOB_INVALID: 1036,
  UPDATE_EMPTY: 1037,
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

  [VALIDATION_CODES.MESSAGE_CONTENT_REQUIRED]: {
    [LanguageEnum.EN]: "Message content is required.",
    [LanguageEnum.AR]: "محتوى الرسالة مطلوب.",
  },
  [VALIDATION_CODES.MESSAGE_CONTENT_INVALID]: {
    [LanguageEnum.EN]: "Message content must be a valid text value.",
    [LanguageEnum.AR]: "يجب أن يكون محتوى الرسالة نصًا صالحًا.",
  },
  [VALIDATION_CODES.MESSAGE_CONTENT_MIN]: {
    [LanguageEnum.EN]: "Message must be at least {min} characters long.",
    [LanguageEnum.AR]: "يجب ألا يقل طول الرسالة عن {min} أحرف.",
  },
  [VALIDATION_CODES.MESSAGE_CONTENT_MAX]: {
    [LanguageEnum.EN]: "Message must not exceed {max} characters.",
    [LanguageEnum.AR]: "يجب ألا يزيد طول الرسالة عن {max} حرف.",
  },

  [VALIDATION_CODES.ID_REQUIRED]: {
    [LanguageEnum.EN]: "ID is required.",
    [LanguageEnum.AR]: "المعرّف مطلوب.",
  },
  [VALIDATION_CODES.ID_INVALID]: {
    [LanguageEnum.EN]: "Invalid ID format.",
    [LanguageEnum.AR]: "صيغة المعرّف غير صحيحة.",
  },

  [VALIDATION_CODES.FILES_INVALID]: {
    [LanguageEnum.EN]: "Files must be a valid list.",
    [LanguageEnum.AR]: "يجب أن تكون الملفات قائمة صالحة.",
  },
  [VALIDATION_CODES.FILES_MAX]: {
    [LanguageEnum.EN]: "You can upload up to {max} files only.",
    [LanguageEnum.AR]: "يمكنك رفع {max} ملفات كحد أقصى.",
  },
  [VALIDATION_CODES.FILE_INVALID]: {
    [LanguageEnum.EN]: "One or more uploaded files are invalid.",
    [LanguageEnum.AR]: "ملف واحد أو أكثر من الملفات المرفوعة غير صالح.",
  },

  [VALIDATION_CODES.MESSAGE_EMPTY]: {
    [LanguageEnum.EN]: "Message must contain text or at least one file.",
    [LanguageEnum.AR]: "يجب أن تحتوي الرسالة على نص أو ملف واحد على الأقل.",
  },

  [VALIDATION_CODES.MESSAGE_TYPE_INVALID]: {
    [LanguageEnum.EN]: "Type must be 0 (received), 1 (sent) or 2 (both).",
    [LanguageEnum.AR]: "يجب أن يكون النوع 0 (مستلمة) أو 1 (مرسلة) أو 2 (الكل).",
  },

  [VALIDATION_CODES.REVEAL_DECISION_INVALID]: {
    [LanguageEnum.EN]: 'Decision must be either "approved" or "rejected".',
    [LanguageEnum.AR]:
      "يجب أن يكون القرار إما \u2066approved\u2069 أو \u2066rejected\u2069.",
  },
  [VALIDATION_CODES.REVEAL_STATUS_INVALID]: {
    [LanguageEnum.EN]: "Status must be one of: pending, approved, rejected.",
    [LanguageEnum.AR]:
      "يجب أن تكون الحالة إحدى القيم: \u2066pending\u2069 أو \u2066approved\u2069 أو \u2066rejected\u2069.",
  },

   [VALIDATION_CODES.FIRST_NAME_INVALID]: {
    [LanguageEnum.EN]: "First name must be between 2 and 25 characters.",
    [LanguageEnum.AR]: "يجب أن يتكون الاسم الأول من 2 إلى 25 حرفًا.",
  },
  [VALIDATION_CODES.LAST_NAME_INVALID]: {
    [LanguageEnum.EN]: "Last name must be between 2 and 25 characters.",
    [LanguageEnum.AR]: "يجب أن يتكون الاسم الأخير من 2 إلى 25 حرفًا.",
  },
  [VALIDATION_CODES.DOB_INVALID]: {
    [LanguageEnum.EN]:
      "Date of birth must be a valid date (YYYY-MM-DD) and cannot be in the future.",
    [LanguageEnum.AR]:
      "يجب أن يكون تاريخ الميلاد تاريخًا صالحًا بالصيغة \u2066YYYY-MM-DD\u2069 وألا يكون في المستقبل.",
  },
  [VALIDATION_CODES.UPDATE_EMPTY]: {
    [LanguageEnum.EN]: "At least one field must be provided to update.",
    [LanguageEnum.AR]: "يجب إرسال حقل واحد على الأقل للتحديث.",
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
