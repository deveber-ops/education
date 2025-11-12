import bcrypt from "bcrypt";
import { authError } from '../../../Core/Errors/auth.errors.js';
import { UsersService } from '../../Users/Services/users.service.js';
import { TokensService } from './tokens.service.js';
const AuthService = {
  async login(userDto) {
    const { loginOrEmail, password } = userDto;
    const user = await UsersService.findUser(loginOrEmail);
    if (!user) throw new authError("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "loginOrEmail");
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new authError("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C.", "password");
    const { password: _, createdAt, ...rest } = user;
    const userData = {
      ...rest,
      id: String(user.id)
    };
    const generatedAccessToken = await TokensService.genAccessToken(userData);
    const generatedRefreshToken = await TokensService.genRefreshToken(userData);
    await TokensService.createRefreshToken(user.id, generatedRefreshToken.refreshToken, new Date(generatedRefreshToken.expires));
    return {
      access: { token: generatedAccessToken.accessToken, expires: generatedAccessToken.expires },
      refresh: { token: generatedRefreshToken.refreshToken, expires: generatedRefreshToken.expires }
    };
  }
};
export {
  AuthService
};
