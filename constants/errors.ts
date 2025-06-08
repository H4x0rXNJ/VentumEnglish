export const ERROR_MESSAGES = {
  EMAIL_ALREADY_USE: "Email is already in use.",
  INVALID_INPUT: "Invalid input. Try again.",
  SIGNUP_API_ERROR: "Register API error:",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  INVALID_CREDENTIALS: "Invalid email or password.",
  ACCOUNT_DISABLED: "Account locked.",
  EMAIL_AND_PASSWORD_REQUIRED: "Email and password are required",
  LOGOUT_SUCCESS: "You’re now signed out.",
} as const;

export const ERROR_CODES = {
  EMAIL_ALREADY_USE: "EMAIL_ALREADY_USE",
  USER_NOT_FOUND: "USER_NOT_FOUND",
} as const;

export const LETTER_REGEX = /[a-zA-Z]/;
export const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
export const RATE_LIMIT_WAIT =
  "Please wait 1 minute before making another request.";

export const ERRORS_PASSWORD = {
  NO_LETTER: "Your password must contain at least one letter.",
  NO_SPECIAL_CHAR: "Your password must contain at least one special character.",
  TOO_SHORT: "Your password must be longer than 8 characters.",
  NOT_MATCH: "The passwords you entered do not match.",
} as const;

export const ERRORS_PASSWORD_MESSAGE =
  "Password must be at least 8 characters long, include a letter (e.g. A, b), a special character (e.g. !, @, #), and must match the confirmation.";
