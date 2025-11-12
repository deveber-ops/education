import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {userTokens} from "../../../Database/schema";

export type TokenType = InferSelectModel<typeof userTokens>;
export type TokenInputType = InferInsertModel<typeof userTokens>;