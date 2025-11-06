import { body } from 'express-validator';

const titleValidation = body('title')
    .exists().withMessage('Заголовок обязателен.')
    .trim()
    .isString().withMessage('Заголовок должен быть строкой.')
    .isLength({ min: 1, max: 30 }).withMessage('Заголовок должен содержать от 1 до 30 символов.')

const descriptionValidation = body('shortDescription')
    .exists().withMessage('Краткое описание обязательно.')
    .trim()
    .isString().withMessage('Краткое описание должно быть строкой.')
    .isLength({ min: 1, max: 100 }).withMessage('Краткое описание должно содержать от 1 до 100 символов.')

const contentValidation = body('content')
    .exists().withMessage('Содержание обязательно.')
    .trim()
    .isString().withMessage('Содержание должно быть строкой.')
    .isLength({ min: 1, max: 1000 }).withMessage('Содержание должно содержать от 1 до 1000 символов.')

const blogIdValidation = body('blogId')
    .exists().withMessage('ID блога обязательно.')
    .trim()

export const postInputValidation= [
    titleValidation,
    descriptionValidation,
    contentValidation,
    blogIdValidation
]

export const postInputValidationWidhoutBlogId= [
    titleValidation,
    descriptionValidation,
    contentValidation
]