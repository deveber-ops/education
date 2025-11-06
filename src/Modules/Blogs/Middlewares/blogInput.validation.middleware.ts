import { body } from 'express-validator';

const nameValidation = body('name')
    .exists().withMessage('Название блога обязательно.')
    .trim()
    .isString().withMessage('Название блога должен быть строкой.')
    .isLength({ min: 1, max: 15 }).withMessage('Название блога должно содержать от 1 до 15 символов.')

const descriptionValidation = body('description')
    .exists().withMessage('Описание блога обязательно.')
    .trim()
    .isString().withMessage('Описание блога должно быть строкой.')
    .isLength({ min: 1, max: 500 }).withMessage('Описание блога должно содержать от 1 до 500 символов.')

const websiteUrlValidation = body('websiteUrl')
    .exists().withMessage('Ссылка на блог обязательна.')
    .trim()
    .isString().withMessage('Ссылка на блог должна быть строкой.')
    .isLength({ min: 1, max: 100 }).withMessage('Ссылка на блог должна содержать от 1 до 100 символов.')
    .isURL().withMessage('Некорректный формат ссылки пример: "https://blog.com"')

export const blogInputValidation= [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation
]