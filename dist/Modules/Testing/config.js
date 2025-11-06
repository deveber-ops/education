import database from '../../Database/database.js';
import { Blogs, Comments, Posts, Users } from '../../Database/schema.js';
import { HttpStatus } from '../../Core/Types/httpStatuses.enum.js';
var config_default = {
  name: "testing",
  path: "/testing",
  label: "\u0422\u0435\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",
  actions: [
    {
      method: "DELETE",
      name: "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0432\u0441\u0435\u0445 \u0434\u0430\u043D\u043D\u044B\u0445",
      path: `/all-data`,
      middlewares: [],
      handler: async (req, res, next) => {
        const db = database.getDB();
        try {
          await db.delete(Comments).execute();
          await db.delete(Posts).execute();
          await db.delete(Blogs).execute();
          await db.delete(Users).execute();
          res.sendStatus(HttpStatus.NoContent);
        } catch (error) {
          next(error);
        }
      },
      authorization: false
    }
  ]
};
export {
  config_default as default
};
