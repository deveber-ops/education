import {paginationAndSortingValidation} from "../../Core/Middlewares/querySortAndPagination.validation.middleware";
import {BlogSortFields} from "./Types/blog.types";
import {validationMiddleware} from "../../Core/Errors/validation.middleware";
import {getBlogsListHandler} from "./Handlers/getBlogsList.handler";
import {idValidation} from "../../Core/Middlewares/idValidation.middleware";
import {blogInputValidation} from "./Middlewares/blogInput.validation.middleware";
import {createBlogHandler} from "./Handlers/createBlog.handler";
import {deleteBlogHandler} from "./Handlers/deleteBlog.handler";
import {getBlogHandler} from "./Handlers/getBlog.handler";
import {updateBlogHandler} from "./Handlers/updateBlog.handler";
import {getPostsListHandler} from "../Posts/Handlers/getPostsList.handler";
import {PostSortFields} from "../Posts/Types/post.types";
import {
    postInputValidationWidhoutBlogId
} from "../Posts/Middlewares/postInput.validation.middleware";
import {createPostHandler} from "../Posts/Handlers/createPost.handler";

export default {
    name: 'blogs',
    path: '/blogs',
    label: 'Блоги',
    actions: [
        {
            method: 'GET',
            name: 'Получение списка блогов',
            path: '/',
            middlewares: [paginationAndSortingValidation(BlogSortFields) ,validationMiddleware],
            handler: getBlogsListHandler,
            authorization: false
        },
        {
            method: 'GET',
            name: 'Получение блога',
            path: '/:id',
            middlewares: [idValidation, validationMiddleware],
            handler: getBlogHandler,
            authorization: false
        },
        {
            method: 'GET',
            name: 'Получение постов блога',
            path: '/:blogId/posts',
            middlewares: [paginationAndSortingValidation(PostSortFields), validationMiddleware],
            handler: getPostsListHandler,
            authorization: false
        },
        {
            method: 'POST',
            name: 'Создание блога',
            path: '/',
            middlewares: [blogInputValidation, validationMiddleware],
            handler: createBlogHandler,
        },
        {
            method: 'POST',
            name: 'Создание поста блога',
            path: '/:blogId/posts',
            middlewares: [postInputValidationWidhoutBlogId, validationMiddleware],
            handler: createPostHandler,
        },
        {
            method: 'PUT',
            name: 'Обновление блога',
            path: '/:id',
            middlewares: [blogInputValidation, validationMiddleware],
            handler: updateBlogHandler,
        },
        {
            method: 'DELETE',
            name: 'Удаление блога',
            path: '/:id',
            middlewares: [idValidation, validationMiddleware],
            handler: deleteBlogHandler,
        },
    ],
}