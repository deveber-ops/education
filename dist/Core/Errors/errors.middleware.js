import { repositoryNotFoundError, repositoryUniqueError } from './repository.errors.js';
import { HttpStatus } from '../Types/httpStatuses.enum.js';
import { authError } from './auth.errors.js';
import { forbiddenError } from './forbidden.errors.js';
const formatErrors = (error) => {
  const expressError = error;
  return {
    message: expressError.msg,
    field: expressError.path
  };
};
const createErrorMessages = (errors) => {
  return { errorsMessages: errors };
};
const errorsMiddleware = (err, req, res, next) => {
  if (err instanceof authError) {
    return res.status(HttpStatus.Unauthorized).json(
      createErrorMessages([{ message: err.message, field: err.field }])
    );
  }
  if (err instanceof repositoryUniqueError) {
    return res.status(HttpStatus.Conflict).json(
      createErrorMessages([{ message: err.message, field: err.field }])
    );
  }
  if (err instanceof repositoryNotFoundError) {
    return res.status(HttpStatus.NotFound).json(
      createErrorMessages([{ message: err.message, field: err.field }])
    );
  }
  if (err instanceof forbiddenError) {
    return res.status(HttpStatus.Forbidden).json(
      createErrorMessages([{ message: err.message, field: err.field }])
    );
  }
  if (err instanceof Error && (err.message.includes("connect") || err.message.includes("ECONNREFUSED") || err.message.includes("access denied") || err.message.includes("getaddrinfo ENOTFOUND"))) {
    return res.status(HttpStatus.InternalServerError).json(
      createErrorMessages([
        {
          message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u043A \u0431\u0430\u0437\u0435 \u0434\u0430\u043D\u043D\u044B\u0445, \u043E\u0431\u0440\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u043A \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0443.",
          field: "database"
        }
      ])
    );
  }
  if (err instanceof Error && "field" in err) {
    return res.status(HttpStatus.BadRequest).json(
      createErrorMessages([{ message: err.message, field: err.field }])
    );
  }
  return res.status(HttpStatus.InternalServerError).json(
    createErrorMessages([{ message: "\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u044F\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430", error: `${err}`, field: "server" }])
  );
};
export {
  createErrorMessages,
  errorsMiddleware,
  formatErrors
};
