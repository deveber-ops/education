import {InferSelectModel} from "drizzle-orm";
import {moduleActions, modules} from "../../../Database/schema";

export type Module = InferSelectModel<typeof modules>;

export type ModuleAction = InferSelectModel<typeof moduleActions>;

export type ModuleWithActions = Module & {
    actions: ModuleAction[];
};