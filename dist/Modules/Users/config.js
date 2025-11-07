import { getUsersListHandler } from './Handlers/getUsersList.handler.js';
import { userInputValidation } from './Middlewares/userInput.validation.middleware.js';
import { validationMiddleware } from '../../Core/Errors/validation.middleware.js';
import { createUserHandler } from './Handlers/createUser.handler.js';
import { idValidation } from '../../Core/Middlewares/idValidation.middleware.js';
import { getUserHandler } from './Handlers/getUser.handler.js';
import { deleteUserHandler } from './Handlers/deleteUser.handler.js';
var config_default = {
  name: "users",
  path: "/users",
  label: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",
  actions: [
    {
      method: "GET",
      name: "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u0441\u043F\u0438\u0441\u043A\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439",
      path: "/",
      middlewares: [],
      handler: getUsersListHandler
    },
    {
      method: "GET",
      name: "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
      path: "/:id",
      middlewares: [idValidation, validationMiddleware],
      handler: getUserHandler
    },
    {
      method: "POST",
      name: "create",
      path: "/",
      middlewares: [userInputValidation, validationMiddleware],
      handler: createUserHandler
    },
    {
      method: "DELETE",
      name: "delete",
      path: "/:id",
      middlewares: [idValidation, validationMiddleware],
      handler: deleteUserHandler
    }
  ]
};
export {
  config_default as default
};
