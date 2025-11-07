import {NextFunction, Request, Response} from "express";
import database from "../../Database/database";
import {HttpStatus} from "../../Core/Types/httpStatuses.enum";
import {sql} from "drizzle-orm";

export default {
    name: 'testing',
    path: '/testing',
    label: 'Тестирование',
    actions: [
        {
            method: 'DELETE',
            name: 'Удаление всех данных',
            path: `/all-data`,
            middlewares: [],
            handler: async (req: Request, res: Response, next: NextFunction) => {
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
        },
    ],
}