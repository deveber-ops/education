import bcrypt from "bcrypt";
import {AuthTypes, UserAuthType} from "../Types/auth.types";
import {generateAccessToken} from "./token.service";
import {authError} from "../../../Core/Errors/auth.errors";
import {UsersService} from "../../Users/Services/users.service";

export const AuthService = {
    async login(userDto: AuthTypes): Promise<UserAuthType> {
        const {loginOrEmail, password} = userDto;

        const user = await UsersService.findUser(loginOrEmail)
        if (!user) throw new authError('Пользователь не найден.', 'loginOrEmail')

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new authError('Неверный пароль.', 'password')

        const accessToken = generateAccessToken(user.id);

        return {accessToken: accessToken}
    }
}