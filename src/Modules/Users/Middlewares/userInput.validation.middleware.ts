import { body } from 'express-validator';

const emailValidation = body('email')
    .exists().withMessage('EMAIL обязателен.')
    .trim()
    .isString().withMessage('E-mail должен быть строкой.')
    .isEmail().withMessage('Формат EMAIL недействителен. Пример: google@google.com.')

const loginValidation = body('login')
    .exists().withMessage('Логин обязателен.')
    .trim()
    .isString().withMessage('Логин должен быть строкой.')
    .isLength({ min: 3, max: 10 }).withMessage('Логин должен содержать от 3 до 10 символов.')
    .matches('^[a-zA-Z0-9_-]*$').withMessage('Логин может содержать только латинские буквы (a-z, A-Z), цифры (0-9), дефис и нижнее подчеркивание.')

const passwordValidation = body('password')
    .exists().withMessage('Пароль обязателен.')
    .isLength({ min: 6, max: 20 }).withMessage('Пароль должен содержать от 6 до 20 символов.')

export const userInputValidation= [
    emailValidation,
    loginValidation,
    passwordValidation
]