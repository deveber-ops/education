import {getCommentHandler} from "./Handlers/getComment.handler";
import {validationMiddleware} from "../../Core/Errors/validation.middleware";
import {idValidation} from "../../Core/Middlewares/idValidation.middleware";
import {commentInputValidation} from "./Middlewares/commentInput.validation.middleware";
import {updateCommentHandler} from "./Handlers/updateComment.handler";
import {deleteCommentHandler} from "./Handlers/deleteComment.handler";

export default {
    name: 'comments',
    path: '/comments',
    label: 'Комментарии',
    actions: [
        {
            method: 'GET',
            name: 'Получение комментария',
            path: '/:id',
            middlewares: [idValidation, validationMiddleware],
            handler: getCommentHandler,
            authorization: false
        },
        {
            method: 'PUT',
            name: 'Обновление комментария',
            path: '/:id',
            middlewares: [commentInputValidation, validationMiddleware],
            handler: updateCommentHandler,
        },
        {
            method: 'DELETE',
            name: 'Удаление комментария',
            path: '/:id',
            middlewares: [idValidation, validationMiddleware],
            handler: deleteCommentHandler,
        },
    ],
}