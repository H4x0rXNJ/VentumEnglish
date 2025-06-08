import {
  LETTER_REGEX,
  SPECIAL_CHAR_REGEX,
  ERRORS_PASSWORD,
} from "@/constants/errors";

export const Validation = {
  validatePassword(password: string): string[] {
    const errors: string[] = [];

    if (!LETTER_REGEX.test(password)) {
      errors.push(ERRORS_PASSWORD.NO_LETTER);
    }
    if (!SPECIAL_CHAR_REGEX.test(password)) {
      errors.push(ERRORS_PASSWORD.NO_SPECIAL_CHAR);
    }
    if (password.length < 8) {
      errors.push(ERRORS_PASSWORD.TOO_SHORT);
    }
    return errors;
  },

  validatePasswordMatch(
    password: string,
    repeatNewPassword: string,
  ): string | null {
    return password === repeatNewPassword ? null : ERRORS_PASSWORD.NOT_MATCH;
  },
};
