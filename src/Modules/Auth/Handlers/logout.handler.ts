import {NextFunction, Request, Response} from "express";
import {authError} from "../../../Core/Errors/auth.errors";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {TokensService} from "../Services/tokens.service";

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;

        if (!userId) return new authError('Не авторизован', 'auth')

        const cookieRefreshToken = req.cookies?.refreshToken;

        if (!cookieRefreshToken) {
            return new authError('Токен продления сессии не передан..', 'refreshToken')
        }

        await TokensService.deleteRefreshTokenRecord(cookieRefreshToken)

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };

        res.clearCookie('refreshToken', cookieOptions)

        return res.sendStatus(HttpStatus.NoContent)
    } catch (error) {
        next(error);
    }
}