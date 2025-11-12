import {Request, Response, NextFunction} from 'express';
import {AuthService} from "../Services/auth.service";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authUser = await AuthService.login(req.body);

        res.cookie('refreshToken', authUser.refresh.token, {
            httpOnly: true,
            secure: true,
            expires: new Date(authUser.refresh.expires),
        })
        return res.status(HttpStatus.Ok).json({
            accessToken: authUser.access.token,
        })
    } catch (error) {
        next(error);
    }
}