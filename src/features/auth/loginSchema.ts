import * as yup from 'yup';

// Messages are i18n keys, translated at render time so they follow language changes.
export const loginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required('auth.validation.usernameRequired')
    .min(3, 'auth.validation.usernameMin'),
  password: yup
    .string()
    .required('auth.validation.passwordRequired')
    .min(6, 'auth.validation.passwordMin'),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export type LoginValidationKey =
  | 'auth.validation.usernameRequired'
  | 'auth.validation.usernameMin'
  | 'auth.validation.passwordRequired'
  | 'auth.validation.passwordMin';
