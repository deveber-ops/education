import {NextFunction, Request, Response} from "express";
import {TokensService} from "../Services/tokens.service";
import {authError} from "../../../Core/Errors/auth.errors";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {UsersService} from "../../Users/Services/users.service";

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;

        if (!userId) return new authError('Не авторизован', 'auth')

        const cookieRefreshToken = req.cookies?.refreshToken;

        if (!cookieRefreshToken) {
            return new authError('Токен продления сессии не передан.', 'refreshToken')
        }

        const {createdAt, ...userData} = await UsersService.findOne(userId);

        const newTokens = await TokensService.verifyRefreshToken(userData, cookieRefreshToken);

        res.cookie('refreshToken', newTokens.refresh.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                expires: new Date(newTokens.refresh.expires),
            })

        return res.status(HttpStatus.Ok).json({
            accessToken: newTokens.access.accessToken,
        })
    } catch (error) {
        next(error);
    }
}