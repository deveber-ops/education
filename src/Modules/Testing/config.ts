import {NextFunction, Request, Response} from "express";
import database from "../../Database/database";
import {Blogs, Comments, Posts, Users} from "../../Database/schema";
import {HttpStatus} from "../../Core/Types/httpStatuses.enum";

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
        },
    ],
}