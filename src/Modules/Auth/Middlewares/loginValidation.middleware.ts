import { body } from 'express-validator';

export const usernameValidation = body('loginOrEmail')
    .trim()
    .notEmpty().withMessage('Имя пользователя или e-mail обязательны.')

export const passwordValidation = body('password')
    .notEmpty().withMessage('Пароль обязателен.')
    .isLength({ min: 6, max: 20 }).withMessage('Пароль должен содержать от 6 до 20 символов.')

export const authValidation = [
    usernameValidation,
    passwordValidation
]