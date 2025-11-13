import {NextFunction, Request, Response} from "express";
import {TokensService} from "../Services/tokens.service";
import {authError} from "../../../Core/Errors/auth.errors";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookieRefreshToken = req.cookies?.refreshToken;

        if (!cookieRefreshToken) return next(new authError('Токен продления сессии не передан.', 'refreshToken'))

        const payloadBase64 = cookieRefreshToken.split(".")[1];
        const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
        const payload = JSON.parse(payloadJson);

        await TokensService.verifyRefreshToken(cookieRefreshToken);
        const newAccessToken = await TokensService.genAccessToken(payload.userData)
        const newRefreshToken = await TokensService.genRefreshToken(payload.userData)
        await TokensService.createRefreshToken(payload.userData.id, newRefreshToken.refreshToken, newRefreshToken.expires)

        res.cookie('refreshToken', newRefreshToken.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                expires: new Date(newRefreshToken.expires),
            })

        return res.status(HttpStatus.Ok).json({
            accessToken: newAccessToken.accessToken,
        })
    } catch (error) {
        next(error);
    }
}