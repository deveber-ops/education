import { validationMiddleware } from '../../Core/Errors/validation.middleware.js';
import { getBlogsListHandler } from './Handlers/getBlogsList.handler.js';
import { idValidation } from '../../Core/Middlewares/idValidation.middleware.js';
import { blogInputValidation } from './Middlewares/blogInput.validation.middleware.js';
import { createBlogHandler } from './Handlers/createBlog.handler.js';
import { deleteBlogHandler } from './Handlers/deleteBlog.handler.js';
import { getBlogHandler } from './Handlers/getBlog.handler.js';
import { updateBlogHandler } from './Handlers/updateBlog.handler.js';
import { getPostsListHandler } from '../Posts/Handlers/getPostsList.handler.js';
import {
  postInputValidationWidhoutBlogId
} from '../Posts/Middlewares/postInput.validation.middleware.js';
import { createPostHandler } from '../Posts/Handlers/createPost.handler.js';
var config_default = {
  name: "blogs",
  path: "/blogs",
  label: "\u0411\u043B\u043E\u0433\u0438",
  actions: [
    {
      method: "GET",
      name: "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u0441\u043F\u0438\u0441\u043A\u0430 \u0431\u043B\u043E\u0433\u043E\u0432",
      path: "/",
      middlewares: [],
      handler: getBlogsListHandler,
      authorization: false
    },
    {
      method: "GET",
      name: "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u0431\u043B\u043E\u0433\u0430",
      path: "/:id",
      middlewares: [idValidation, validationMiddleware],
      handler: getBlogHandler,
      authorization: false
    },
    {
      method: "GET",
      name: "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043F\u043E\u0441\u0442\u043E\u0432 \u0431\u043B\u043E\u0433\u0430",
      path: "/:blogId/posts",
      middlewares: [],
      handler: getPostsListHandler,
      authorization: false
    },
    {
      method: "POST",
      name: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0431\u043B\u043E\u0433\u0430",
      path: "/",
      middlewares: [blogInputValidation, validationMiddleware],
      handler: createBlogHandler
    },
    {
      method: "POST",
      name: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043F\u043E\u0441\u0442\u0430 \u0431\u043B\u043E\u0433\u0430",
      path: "/:blogId/posts",
      middlewares: [postInputValidationWidhoutBlogId, validationMiddleware],
      handler: createPostHandler
    },
    {
      method: "PUT",
      name: "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0431\u043B\u043E\u0433\u0430",
      path: "/:id",
      middlewares: [blogInputValidation, validationMiddleware],
      handler: updateBlogHandler
    },
    {
      method: "DELETE",
      name: "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0431\u043B\u043E\u0433\u0430",
      path: "/:id",
      middlewares: [idValidation, validationMiddleware],
      handler: deleteBlogHandler
    }
  ]
};
export {
  config_default as default
};
