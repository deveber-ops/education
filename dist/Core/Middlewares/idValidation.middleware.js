import { param } from "express-validator";
const idValidation = param("id").exists().withMessage("ID \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D.").isNumeric().withMessage("ID \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0447\u0438\u0441\u043B\u043E\u0432\u044B\u043C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435\u043C.").bail();
export {
  idValidation
};
