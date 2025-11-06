import bcrypt from "bcrypt";
import {LoginDto, UserAuthType} from "../Types/login.dto";
import {generateAccessToken} from "./token.service";
import {authError} from "../../../Core/Errors/auth.errors";
import {UsersRepository} from "../../Users/Repositories/users.repository";

export const AuthService = {
    async login(userDto: LoginDto): Promise<UserAuthType> {
        const {loginOrEmail, password} = userDto;

        const user = await UsersRepository.findUser(loginOrEmail)
        if (!user) throw new authError('Пользователь не найден.', 'loginOrEmail')

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new authError('Неверный пароль.', 'password')

        const accessToken = generateAccessToken(user.id);

        return {accessToken: accessToken}
    }
}