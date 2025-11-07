import { paginationAndSortingValidation } from '../../Core/Middlewares/querySortAndPagination.validation.middleware.js';
import { PostSortFields } from './Types/post.types.js';
import { validationMiddleware } from '../../Core/Errors/validation.middleware.js';
import { getPostsListHandler } from './Handlers/getPostsList.handler.js';
import { idValidation } from '../../Core/Middlewares/idValidation.middleware.js';
import { getPostHandler } from './Handlers/getPost.handler.js';
import { postInputValidation } from './Middlewares/postInput.validation.middleware.js';
import { createPostHandler } from './Handlers/createPost.handler.js';
import { updatePostHandler } from './Handlers/updatePost.handler.js';
import { deletePostHandler } from './Handlers/deletePost.handler.js';
import { CommentSortFields } from '../Comments/Types/comment.types.js';
import { getCommentsListHandler } from '../Comments/Handlers/getCommentsList.handler.js';
import { commentInputValidation } from '../Comments/Middlewares/commentInput.validation.middleware.js';
import { createCommentHandler } from '../Comments/Handlers/createComment.handler.js';
var config_default = {
  name: "posts",
  path: "/posts",
  label: "\u041F\u043E\u0441\u0442\u044B",
  actions: [
    {
      method: "GET",
      name: "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u0441\u043F\u0438\u0441\u043A\u0430 \u043F\u043E\u0441\u0442\u043E\u0432",
      path: "/",
      middlewares: [paginationAndSortingValidation(PostSortFields), validationMiddleware],
      handler: getPostsListHandler,
      authorization: false
    },
    {
      method: "GET",
      name: "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043F\u043E\u0441\u0442\u0430",
      path: "/:id",
      middlewares: [idValidation, validationMiddleware],
      handler: getPostHandler,
      authorization: false
    },
    {
      method: "GET",
      name: "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432 \u043F\u043E\u0441\u0442\u0430",
      path: "/:postId/comments",
      middlewares: [paginationAndSortingValidation(CommentSortFields), validationMiddleware],
      handler: getCommentsListHandler,
      authorization: false
    },
    {
      method: "POST",
      name: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043F\u043E\u0441\u0442\u0430",
      path: "/",
      middlewares: [postInputValidation, validationMiddleware],
      handler: createPostHandler
    },
    {
      method: "POST",
      name: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u044F \u0432 \u043F\u043E\u0441\u0442\u0435",
      path: "/:postId/comments",
      middlewares: [commentInputValidation, validationMiddleware],
      handler: createCommentHandler
    },
    {
      method: "PUT",
      name: "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u0441\u0442\u0430",
      path: "/:id",
      middlewares: [postInputValidation, validationMiddleware],
      handler: updatePostHandler
    },
    {
      method: "DELETE",
      name: "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u0441\u0442\u0430",
      path: "/:id",
      middlewares: [idValidation, validationMiddleware],
      handler: deletePostHandler
    }
  ]
};
export {
  config_default as default
};
