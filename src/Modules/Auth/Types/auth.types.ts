import {InferSelectModel} from "drizzle-orm";
import {registrationSessions} from "../../../Database/schema";

export interface AuthTypes {
    loginOrEmail: string;
    password: string;
}

export type UserAuthType = {
    access: {token: string, expires: number};
    refresh: {token: string, expires: number};
}

export type registrationSessionsType = InferSelectModel<typeof registrationSessions>;