import { eq, and } from "drizzle-orm";
import {ModuleWithActions} from "../Types/module.types";
import database from "../../../Database/database";
import {moduleActions, modules} from "../../../Database/schema";

export const ModulesRepository = {
    async getAllModulesWithActions(): Promise<ModuleWithActions[]> {
        const db = await database.getDB();
        const allModules = await db
            .select()
            .from(modules)
            .where(eq(modules.active, true))
            .orderBy(modules.id);

        const allActions = await db
            .select()
            .from(moduleActions)
            .where(eq(moduleActions.active, true))
            .orderBy(moduleActions.id);

        // Группируем actions по moduleId
        const actionsByModuleId = allActions.reduce((
            acc: Record<number, typeof allActions>,
            action: typeof allActions[0]
        ) => {
            if (!acc[action.moduleId]) {
                acc[action.moduleId] = [];
            }
            acc[action.moduleId].push(action);
            return acc;
        }, {});

        // Объединяем модули с их действиями
        return allModules.map((module: typeof allModules[0]) => ({
            ...module,
            actions: actionsByModuleId[module.id] || []
        }));
    },

    async updateModuleStatus(name: string, active: boolean): Promise<void> {
        const db = await database.getDB();
        await db
            .update(modules)
            .set({
                active,
                updatedAt: new Date()
            })
            .where(eq(modules.name, name));
    },

    async updateActionStatus(moduleName: string, actionName: string, active: boolean): Promise<void> {
        const db = await database.getDB();

        const [module] = await db
            .select({ id: modules.id })
            .from(modules)
            .where(eq(modules.name, moduleName))
            .limit(1);

        if (!module) {
            throw new Error(`Module ${moduleName} not found`);
        }

        await db
            .update(moduleActions)
            .set({
                active,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(moduleActions.name, actionName),
                    eq(moduleActions.moduleId, module.id)
                )
            );
    },

    async updateModuleLabel(name: string, label: string): Promise<void> {
        const db = await database.getDB();
        await db
            .update(modules)
            .set({
                label,
                updatedAt: new Date()
            })
            .where(eq(modules.name, name));
    },

    async updateActionLabel(moduleName: string, actionName: string, label: string): Promise<void> {
        const db = await database.getDB();

        const [module] = await db
            .select({ id: modules.id })
            .from(modules)
            .where(eq(modules.name, moduleName))
            .limit(1);

        if (!module) {
            throw new Error(`Module ${moduleName} not found`);
        }

        await db
            .update(moduleActions)
            .set({
                label,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(moduleActions.name, actionName),
                    eq(moduleActions.moduleId, module.id)
                )
            );
    },

    async updateModuleMenu(name: string, menu: boolean): Promise<void> {
        const db = await database.getDB();
        await db
            .update(modules)
            .set({
                menu,
                updatedAt: new Date()
            })
            .where(eq(modules.name, name));
    },

    async getModuleByName(name: string): Promise<ModuleWithActions | null> {
        const db = await database.getDB();

        const [module] = await db
            .select()
            .from(modules)
            .where(eq(modules.name, name))
            .limit(1);

        if (!module) return null;

        const moduleActionsList = await db
            .select()
            .from(moduleActions)
            .where(
                and(
                    eq(moduleActions.moduleId, module.id),
                    eq(moduleActions.active, true)
                )
            );

        return {
            ...module,
            actions: moduleActionsList
        };
    },

    async syncModuleFromConfig(moduleConfig: any): Promise<void> {
        const db = await database.getDB();
        const { name, path, system, label, active, menu, actions } = moduleConfig;

        try {
            // Проверяем, существует ли модуль
            const [existingModule] = await db
                .select()
                .from(modules)
                .where(eq(modules.name, name))
                .limit(1);

            if (existingModule) {
                // Обновляем существующий модуль - только технические поля
                await db
                    .update(modules)
                    .set({
                        path,
                        system: system || false,
                        // Мета-данные обновляем только если они пришли из конфига
                        ...(label !== undefined && { label }),
                        ...(active !== undefined && { active }),
                        ...(menu !== undefined && { menu }),
                        updatedAt: new Date(),
                    })
                    .where(eq(modules.name, name));
            } else {
                // Создаем новый модуль
                await db
                    .insert(modules)
                    .values({
                        name,
                        label: label || name,
                        path,
                        system: system || false,
                        active: active !== undefined ? active : true,
                        menu: menu !== undefined ? menu : false,
                        sortOrder: 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
            }

            // Получаем ID модуля
            const [module] = await db
                .select({ id: modules.id })
                .from(modules)
                .where(eq(modules.name, name))
                .limit(1);

            if (!module) {
                 new Error(`Failed to get module ID for ${name}`);
            }

            // Синхронизируем actions
            for (const action of actions) {
                const method = (action.method || 'GET').toUpperCase();

                const [existingAction] = await db
                    .select()
                    .from(moduleActions)
                    .where(
                        and(
                            eq(moduleActions.moduleId, module.id),
                            eq(moduleActions.method, method),
                            eq(moduleActions.path, action.path)
                        )
                    )
                    .limit(1);

                if (existingAction) {
                    // Обновляем существующий action - только если значения пришли из конфига
                    await db
                        .update(moduleActions)
                        .set({
                            name: action.name,
                            // Мета-данные обновляем только если они заданы в конфиге
                            ...(action.label !== undefined && { label: action.label }),
                            ...(action.authorization !== undefined && { authorization: action.authorization }),
                            ...(action.active !== undefined && { active: action.active }),
                            updatedAt: new Date(),
                        })
                        .where(eq(moduleActions.id, existingAction.id));
                } else {
                    // Создаем новый action
                    await db
                        .insert(moduleActions)
                        .values({
                            moduleId: module.id,
                            name: action.name,
                            path: action.path,
                            label: action.label || action.name,
                            method: method,
                            authorization: action.authorization !== undefined ? action.authorization : false,
                            active: action.active !== undefined ? action.active : true,
                            sortOrder: 0,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                }
            }

        } catch (error) {
            console.error(`❌ Failed to sync module ${name}:`, error);
            throw error;
        }
    }
};