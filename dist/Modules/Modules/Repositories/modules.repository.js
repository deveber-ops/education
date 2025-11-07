import { eq, and } from "drizzle-orm";
import database from '../../../Database/database.js';
import { moduleActions, modules } from '../../../Database/schema.js';
const ModulesRepository = {
  async getAllModulesWithActions() {
    const db = await database.getDB();
    const allModules = await db.select().from(modules).where(eq(modules.active, true)).orderBy(modules.id);
    const allActions = await db.select().from(moduleActions).where(eq(moduleActions.active, true)).orderBy(moduleActions.id);
    const actionsByModuleId = allActions.reduce((acc, action) => {
      if (!acc[action.moduleId]) {
        acc[action.moduleId] = [];
      }
      acc[action.moduleId].push(action);
      return acc;
    }, {});
    return allModules.map((module) => ({
      ...module,
      actions: actionsByModuleId[module.id] || []
    }));
  },
  async updateModuleStatus(name, active) {
    const db = await database.getDB();
    await db.update(modules).set({
      active,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(modules.name, name));
  },
  async updateActionStatus(moduleName, actionName, active) {
    const db = await database.getDB();
    const [module] = await db.select({ id: modules.id }).from(modules).where(eq(modules.name, moduleName)).limit(1);
    if (!module) {
      throw new Error(`Module ${moduleName} not found`);
    }
    await db.update(moduleActions).set({
      active,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(
      and(
        eq(moduleActions.name, actionName),
        eq(moduleActions.moduleId, module.id)
      )
    );
  },
  async updateModuleLabel(name, label) {
    const db = await database.getDB();
    await db.update(modules).set({
      label,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(modules.name, name));
  },
  async updateActionLabel(moduleName, actionName, label) {
    const db = await database.getDB();
    const [module] = await db.select({ id: modules.id }).from(modules).where(eq(modules.name, moduleName)).limit(1);
    if (!module) {
      throw new Error(`Module ${moduleName} not found`);
    }
    await db.update(moduleActions).set({
      label,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(
      and(
        eq(moduleActions.name, actionName),
        eq(moduleActions.moduleId, module.id)
      )
    );
  },
  async updateModuleMenu(name, menu) {
    const db = await database.getDB();
    await db.update(modules).set({
      menu,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(modules.name, name));
  },
  async getModuleByName(name) {
    const db = await database.getDB();
    const [module] = await db.select().from(modules).where(eq(modules.name, name)).limit(1);
    if (!module) return null;
    const moduleActionsList = await db.select().from(moduleActions).where(
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
  async syncModuleFromConfig(moduleConfig) {
    const db = await database.getDB();
    const { name, path, system, label, active, menu, actions } = moduleConfig;
    try {
      const [existingModule] = await db.select().from(modules).where(eq(modules.name, name)).limit(1);
      if (existingModule) {
        await db.update(modules).set({
          path,
          system: system || false,
          // Мета-данные обновляем только если они пришли из конфига
          ...label !== void 0 && { label },
          ...active !== void 0 && { active },
          ...menu !== void 0 && { menu },
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(modules.name, name));
      } else {
        await db.insert(modules).values({
          name,
          label: label || name,
          path,
          system: system || false,
          active: active !== void 0 ? active : true,
          menu: menu !== void 0 ? menu : false,
          sortOrder: 0,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      const [module] = await db.select({ id: modules.id }).from(modules).where(eq(modules.name, name)).limit(1);
      if (!module) {
        new Error(`Failed to get module ID for ${name}`);
      }
      for (const action of actions) {
        const method = (action.method || "GET").toUpperCase();
        const [existingAction] = await db.select().from(moduleActions).where(
          and(
            eq(moduleActions.moduleId, module.id),
            eq(moduleActions.method, method),
            eq(moduleActions.path, action.path)
          )
        ).limit(1);
        if (existingAction) {
          await db.update(moduleActions).set({
            name: action.name,
            // Мета-данные обновляем только если они заданы в конфиге
            ...action.label !== void 0 && { label: action.label },
            ...action.authorization !== void 0 && { authorization: action.authorization },
            ...action.active !== void 0 && { active: action.active },
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(moduleActions.id, existingAction.id));
        } else {
          await db.insert(moduleActions).values({
            moduleId: module.id,
            name: action.name,
            path: action.path,
            label: action.label || action.name,
            method,
            authorization: action.authorization !== void 0 ? action.authorization : false,
            active: action.active !== void 0 ? action.active : true,
            sortOrder: 0,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          });
        }
      }
    } catch (error) {
      console.error(`\u274C Failed to sync module ${name}:`, error);
      throw error;
    }
  }
};
export {
  ModulesRepository
};
