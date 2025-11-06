import { validationResult } from "express-validator";
import { HttpStatus } from '../Types/httpStatuses.enum.js';
import { createErrorMessages, formatErrors } from './errors.middleware.js';
const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true });
  if (errors.length > 0) {
    return res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
  }
  next();
};
export {
  validationMiddleware
};
