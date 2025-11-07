import database from '../../Database/database.js';
import { HttpStatus } from '../../Core/Types/httpStatuses.enum.js';
import { sql } from "drizzle-orm";
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
          await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
          await db.execute(sql`TRUNCATE TABLE Comments`);
          await db.execute(sql`TRUNCATE TABLE Posts`);
          await db.execute(sql`TRUNCATE TABLE Blogs`);
          await db.execute(sql`TRUNCATE TABLE Users`);
          await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);
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
