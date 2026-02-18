import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Email обязателен для заполнения'),
  password: yup
    .string()
    .required('Пароль обязателен для заполнения'),
});

export const registerSchema = yup.object({
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Email обязателен для заполнения'),
  password: yup
    .string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .required('Пароль обязателен для заполнения'),
  fullName: yup
    .string()
    .required('Имя обязательно для заполнения'),
});
