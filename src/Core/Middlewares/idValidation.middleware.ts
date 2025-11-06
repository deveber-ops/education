import { param } from 'express-validator';

export const idValidation = param('id')
    .exists().withMessage('ID обязателен.') // Проверка на наличие
    .isNumeric().withMessage('ID должен быть числовым значением.').bail() // Проверка, что это число