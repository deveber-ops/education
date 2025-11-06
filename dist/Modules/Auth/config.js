import { loginHandler } from './Handlers/login.handler.js';
import { userInfoHandler } from './Handlers/userInfo.handler.js';
import { authValidation } from './Middlewares/loginValidation.middleware.js';
import { validationMiddleware } from '../../Core/Errors/validation.middleware.js';
var config_default = {
  name: "auth",
  path: "/auth",
  label: "\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F",
  system: true,
  active: true,
  menu: false,
  actions: [
    {
      method: "POST",
      name: "login",
      path: "/login",
      label: "\u0412\u0445\u043E\u0434 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443",
      middlewares: [authValidation, validationMiddleware],
      handler: loginHandler,
      authorization: false
    },
    {
      method: "GET",
      name: "userInfo",
      path: "/me",
      label: "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D\u043D\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
      middlewares: [],
      handler: userInfoHandler
    }
  ]
};
export {
  config_default as default
};
