import {getUsersListHandler} from "./Handlers/getUsersList.handler";
import {userInputValidation} from "./Middlewares/userInput.validation.middleware";
import {validationMiddleware} from "../../Core/Errors/validation.middleware";
import {createUserHandler} from "./Handlers/createUser.handler";
import {idValidation} from "../../Core/Middlewares/idValidation.middleware";
import {getUserHandler} from "./Handlers/getUser.handler";
import {deleteUserHandler} from "./Handlers/deleteUser.handler";

export default {
    name: 'users',
    path: '/users',
    label: 'Пользователи',
    actions: [
        {
            method: 'GET',
            name: 'Получение списка пользователей',
            path: '/',
            middlewares: [],
            handler: getUsersListHandler,
        },
        {
            method: 'GET',
            name: 'Получение пользователя',
            path: '/:id',
            middlewares: [idValidation, validationMiddleware],
            handler: getUserHandler,
        },
        {
            method: 'POST',
            name: 'create',
            path: '/',
            middlewares: [userInputValidation, validationMiddleware],
            handler: createUserHandler,
        },
        {
            method: 'DELETE',
            name: 'delete',
            path: '/:id',
            middlewares: [idValidation, validationMiddleware],
            handler: deleteUserHandler,
        },
    ],
}