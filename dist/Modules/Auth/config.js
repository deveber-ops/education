import { loginHandler } from './Handlers/login.handler.js';
import { userInfoHandler } from './Handlers/userInfo.handler.js';
import { authValidation } from './Middlewares/loginValidation.middleware.js';
import { validationMiddleware } from '../../Core/Errors/validation.middleware.js';
import { userInputValidation } from '../Users/Middlewares/userInput.validation.middleware.js';
import { registrationHandler } from './Handlers/registration.handler.js';
import { refreshTokenHandler } from './Handlers/refreshToken.handler.js';
import { logoutHandler } from './Handlers/logout.handler.js';
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
      name: "\u0412\u0445\u043E\u0434 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443",
      path: "/login",
      middlewares: [authValidation, validationMiddleware],
      handler: loginHandler,
      authorization: false
    },
    {
      method: "POST",
      name: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435 \u0441\u0435\u0430\u043D\u0441\u0430",
      path: "/logout",
      middlewares: [],
      handler: logoutHandler
    },
    {
      method: "POST",
      name: "\u0412\u0435\u0440\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u044F \u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u044B\u0445 \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438",
      path: "/refresh-token",
      middlewares: [],
      handler: refreshTokenHandler,
      authorization: false
    },
    {
      method: "GET",
      name: "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D\u043D\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
      path: "/me",
      middlewares: [],
      handler: userInfoHandler
    },
    {
      method: "POST",
      name: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
      path: "/registration",
      middlewares: [userInputValidation, validationMiddleware],
      handler: registrationHandler,
      authorization: false
    },
    {
      method: "POST",
      name: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438",
      path: "/registration-confirmation",
      middlewares: [],
      handler: registrationHandler,
      authorization: false
    },
    {
      method: "POST",
      name: "\u041F\u043E\u0432\u0442\u043E\u0440\u043D\u0430\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u043A\u043E\u0434\u0430 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
      path: "/registration-email-resending",
      middlewares: [],
      handler: registrationHandler,
      authorization: false
    }
  ]
};
export {
  config_default as default
};
