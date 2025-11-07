import {validationMiddleware} from "../../Core/Errors/validation.middleware";
import {getPostsListHandler} from "./Handlers/getPostsList.handler";
import {idValidation} from "../../Core/Middlewares/idValidation.middleware";
import {getPostHandler} from "./Handlers/getPost.handler";
import {postInputValidation} from "./Middlewares/postInput.validation.middleware";
import {createPostHandler} from "./Handlers/createPost.handler";
import {updatePostHandler} from "./Handlers/updatePost.handler";
import {deletePostHandler} from "./Handlers/deletePost.handler";
import {getCommentsListHandler} from "../Comments/Handlers/getCommentsList.handler";
import {commentInputValidation} from "../Comments/Middlewares/commentInput.validation.middleware";
import {createCommentHandler} from "../Comments/Handlers/createComment.handler";

export default {
    name: 'posts',
    path: '/posts',
    label: 'Посты',
    actions: [
        {
            method: 'GET',
            name: 'Получение списка постов',
            path: '/',
            middlewares: [],
            handler: getPostsListHandler,
            authorization: false
        },
        {
            method: 'GET',
            name: 'Получение поста',
            path: '/:id',
            middlewares: [idValidation, validationMiddleware],
            handler: getPostHandler,
            authorization: false
        },
        {
            method: 'GET',
            name: 'Получение комментариев поста',
            path: '/:postId/comments',
            middlewares: [],
            handler: getCommentsListHandler,
            authorization: false
        },
        {
            method: 'POST',
            name: 'Создание поста',
            path: '/',
            middlewares: [postInputValidation, validationMiddleware],
            handler: createPostHandler,
        },
        {
            method: 'POST',
            name: 'Создание комментария в посте',
            path: '/:postId/comments',
            middlewares: [commentInputValidation, validationMiddleware],
            handler: createCommentHandler,
        },
        {
            method: 'PUT',
            name: 'Обновление поста',
            path: '/:id',
            middlewares: [postInputValidation, validationMiddleware],
            handler: updatePostHandler,
        },
        {
            method: 'DELETE',
            name: 'Удаление поста',
            path: '/:id',
            middlewares: [idValidation, validationMiddleware],
            handler: deletePostHandler,
        },
    ],
}