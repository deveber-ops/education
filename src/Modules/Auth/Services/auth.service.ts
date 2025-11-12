import bcrypt from "bcrypt";
import {AuthTypes, UserAuthType} from "../Types/auth.types";
import {authError} from "../../../Core/Errors/auth.errors";
import {UsersService} from "../../Users/Services/users.service";
import {TokensService} from "./tokens.service";

export const AuthService = {
    async login(userDto: AuthTypes): Promise<UserAuthType> {
        const {loginOrEmail, password} = userDto;

        const user = await UsersService.findUser(loginOrEmail)
        if (!user) throw new authError('Пользователь не найден.', 'loginOrEmail')

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new authError('Неверный пароль.', 'password')

        const { password: _, createdAt, ...rest } = user;
        const userData = {
            ...rest,
            id: String(user.id),
        };

        const generatedAccessToken = await TokensService.genAccessToken(userData);
        const generatedRefreshToken = await TokensService.genRefreshToken(userData)

        await TokensService.createRefreshToken(user.id, generatedRefreshToken.refreshToken, generatedRefreshToken.expires)

        return {
            access: {token: generatedAccessToken.accessToken, expires: generatedAccessToken.expires},
            refresh: {token: generatedRefreshToken.refreshToken, expires: generatedRefreshToken.expires}
        }
    }
}