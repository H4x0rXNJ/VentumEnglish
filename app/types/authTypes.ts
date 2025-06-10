export enum AuthType {
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
  DATABASE = "DATABASE",
}

export type User = {
  email?: string | null;
  avatar?: string | null;
  name?: string | null;
  authType: AuthType;
};
