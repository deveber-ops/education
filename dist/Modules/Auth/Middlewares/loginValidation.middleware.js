import { body } from "express-validator";
const usernameValidation = body("loginOrEmail").trim().notEmpty().withMessage("\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0438\u043B\u0438 e-mail \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B.");
const passwordValidation = body("password").notEmpty().withMessage("\u041F\u0430\u0440\u043E\u043B\u044C \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D.").isLength({ min: 6, max: 20 }).withMessage("\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043E\u0442 6 \u0434\u043E 20 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
const authValidation = [
  usernameValidation,
  passwordValidation
];
export {
  authValidation,
  passwordValidation,
  usernameValidation
};
