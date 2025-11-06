import {loginHandler} from "./Handlers/login.handler";
import {userInfoHandler} from "./Handlers/userInfo.handler";
import {authValidation} from "./Middlewares/loginValidation.middleware";
import {validationMiddleware} from "../../Core/Errors/validation.middleware";

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
            name: 'login',
            path: '/login',
            label: 'Вход в систему',
            middlewares: [authValidation, validationMiddleware],
            handler: loginHandler,
            authorization: false,
        },
        {
            method: 'GET',
            name: 'userInfo',
            path: '/me',
            label: 'Получение информации авторизованного пользователя',
            middlewares: [],
            handler: userInfoHandler,
        },
    ],
}