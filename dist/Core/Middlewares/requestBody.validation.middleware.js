import { HttpStatus } from '../Types/httpStatuses.enum.js';
import { createErrorMessages } from '../Errors/errors.middleware.js';
const bodyValidationMiddleware = (req, res, next) => {
  if (!req.body) {
    return res.status(HttpStatus.BadRequest).json(
      createErrorMessages([{
        message: "Request body is missing or invalid JSON",
        field: "body"
      }])
    );
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(HttpStatus.BadRequest).json(
      createErrorMessages([{
        message: "Request body cannot be empty",
        field: "body"
      }])
    );
  }
  next();
};
export {
  bodyValidationMiddleware
};
