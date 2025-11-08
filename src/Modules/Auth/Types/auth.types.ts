import {InferSelectModel} from "drizzle-orm";
import {registrationSessions} from "../../../Database/schema";

export interface AuthTypes {
    loginOrEmail: string;
    password: string;
}

export type UserAuthType = {
    accessToken: string;
}

export type registrationSessionsType = InferSelectModel<typeof registrationSessions>;