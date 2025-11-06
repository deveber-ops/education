import { getCommentHandler } from './Handlers/getComment.handler.js';
import { validationMiddleware } from '../../Core/Errors/validation.middleware.js';
import { idValidation } from '../../Core/Middlewares/idValidation.middleware.js';
import { commentInputValidation } from './Middlewares/commentInput.validation.middleware.js';
import { updateCommentHandler } from './Handlers/updateComment.handler.js';
import { deleteCommentHandler } from './Handlers/deleteComment.handler.js';
var config_default = {
  name: "comments",
  path: "/comments",
  label: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438",
  actions: [
    {
      method: "GET",
      name: "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u044F",
      path: "/:id",
      middlewares: [idValidation, validationMiddleware],
      handler: getCommentHandler,
      authorization: false
    },
    {
      method: "PUT",
      name: "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u044F",
      path: "/:id",
      middlewares: [commentInputValidation, validationMiddleware],
      handler: updateCommentHandler
    },
    {
      method: "DELETE",
      name: "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u044F",
      path: "/:id",
      middlewares: [idValidation, validationMiddleware],
      handler: deleteCommentHandler
    }
  ]
};
export {
  config_default as default
};
