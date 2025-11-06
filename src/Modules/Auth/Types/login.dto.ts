export interface LoginDto {
    loginOrEmail: string;
    password: string;
}

export type UserAuthType = {
    accessToken: string;
}