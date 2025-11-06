import { body } from 'express-validator';

const contentValidation = body('content')
    .exists().withMessage('Содержание комментария обязательно.')
    .trim()
    .isString().withMessage('Содержание комментария должно быть строкой.')
    .isLength({ min: 20, max: 300 }).withMessage('Содержание комментария должно содержать от 1 до 15 символов.')

export const commentInputValidation= [
    contentValidation,
]