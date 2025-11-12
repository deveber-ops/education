import {loginHandler} from "./Handlers/login.handler";
import {userInfoHandler} from "./Handlers/userInfo.handler";
import {authValidation} from "./Middlewares/loginValidation.middleware";
import {validationMiddleware} from "../../Core/Errors/validation.middleware";
import {userInputValidation} from "../Users/Middlewares/userInput.validation.middleware";
import {registrationHandler} from "./Handlers/registration.handler";
import {refreshTokenHandler} from "./Handlers/refreshToken.handler";

export default {
    name: 'auth',
    path: '/auth',
    label: 'Авторизация',
    system: true,
    active: true,
    menu: false,
    actions: [
        {
            method: 'POST',
            name: 'Вход в систему',
            path: '/login',
            middlewares: [authValidation, validationMiddleware],
            handler: loginHandler,
            authorization: false,
        },
        {
            method: 'POST',
            name: 'Верификация и получение новых токенов авторизации',
            path: '/refresh-token',
            middlewares: [],
            handler: refreshTokenHandler,
            authorization: true,
        },
        {
            method: 'GET',
            name: 'Получение информации авторизованного пользователя',
            path: '/me',
            middlewares: [],
            handler: userInfoHandler,
        },
        {
            method: 'POST',
            name: 'Регистрация пользователя',
            path: '/registration',
            middlewares: [userInputValidation, validationMiddleware],
            handler: registrationHandler,
            authorization: false,
        },
        {
            method: 'POST',
            name: 'Подтверждение регистрации',
            path: '/registration-confirmation',
            middlewares: [],
            handler: registrationHandler,
            authorization: false,
        },
        {
            method: 'POST',
            name: 'Повторная отправка кода подтверждения',
            path: '/registration-email-resending',
            middlewares: [],
            handler: registrationHandler,
            authorization: false,
        },
    ],
}