import {Request, Response, NextFunction} from 'express';
import {AuthService} from "../Services/auth.service";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authUser = await AuthService.login(req.body);

        res.cookie('accessToken', authUser.accessToken);
        return res.status(HttpStatus.Ok).json({
            accessToken: authUser.accessToken,
        })
    } catch (error) {
        next(error);
    }
}