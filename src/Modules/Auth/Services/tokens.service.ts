import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import {TokensRepository} from "../Repositories/tokes.repository";
import {authError} from "../../../Core/Errors/auth.errors";
import {UserInfoType} from "../../Users/Types/user.types";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRES = parseInt(String(process.env.ACCESS_TOKEN_EXPIRES_SECONDS || 10), 10);
const REFRESH_TOKEN_EXPIRES = parseInt(String(process.env.REFRESH_TOKEN_EXPIRES_SECONDS || 20), 10);

export const TokensService = {
    async genAccessToken(userData: UserInfoType) {
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const token = jwt.sign(
            { userData },
            JWT_SECRET,
            {expiresIn: ACCESS_TOKEN_EXPIRES,}
        );

        return {
            accessToken: token,
            userData: userData,
            expires: ACCESS_TOKEN_EXPIRES,
        }
    },

    async genRefreshToken(userData: UserInfoType) {
        if (!JWT_REFRESH_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const token = jwt.sign(
            { userData },
            JWT_REFRESH_SECRET,
            {expiresIn: REFRESH_TOKEN_EXPIRES,}
        );

        return {
            refreshToken: token,
            userData: userData,
            expires: REFRESH_TOKEN_EXPIRES,
        }
    },

    async verifyRefreshToken(userData: UserInfoType, refreshToken: string) {
        const tokenRecord = await this.getRefreshTokenRecord(refreshToken);

        if (!tokenRecord) throw new authError('Токен продления авторизации не найден.', 'refreshToken')
        if (tokenRecord.token !== refreshToken || tokenRecord.expiresAt < new Date()) {
            throw new authError('Токен продления авторизации недействителен.', 'refreshToken')
        }

        await this.deleteRefreshTokenRecord(refreshToken)

        return {
            access: await this.genAccessToken(userData),
            refresh: await this.genRefreshToken(userData),
        }
    },

    async createRefreshToken(userId: number, refreshToken: string, expires: number) {
        await TokensRepository.createRefreshTokenRecord(userId, refreshToken, expires);
    },

    async getRefreshTokenRecord(refreshToken: string) {
        return await TokensRepository.getRefreshTokenRecord(refreshToken);
    },

    async deleteRefreshTokenRecord(refreshToken: string) {
        await TokensRepository.deleteRefreshTokenRecord(refreshToken);
    },
}