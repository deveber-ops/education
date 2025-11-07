import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { HttpStatus } from '../Core/Types/httpStatuses.enum.js';
import { ModulesRepository } from '../Modules/Modules/Repositories/modules.repository.js';
import { authMiddleware } from '../Modules/Auth/Middlewares/auth.middleware.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulesPath = path.resolve(__dirname, "../Modules");
const router = express.Router();
const consoleOutput = true;
let globalModulesConfig = { modules: [] };
const methodMap = {
  get: router.get.bind(router),
  post: router.post.bind(router),
  put: router.put.bind(router),
  delete: router.delete.bind(router),
  patch: router.patch.bind(router)
};
function createModuleActiveMiddleware(moduleActive) {
  return (_req, res, next) => {
    if (!moduleActive) {
      return res.status(HttpStatus.Locked).json({
        error: "MODULE_DISABLED",
        message: "\u041C\u043E\u0434\u0443\u043B\u044C \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D."
      });
    }
    next();
  };
}
function createRouteInfoMiddleware(moduleName, actionName, actionAuth) {
  return (req, res, next) => {
    res.locals.routeInfo = {
      module: moduleName,
      action: {
        [actionName]: { auth: actionAuth }
      }
    };
    next();
  };
}
let currentRoutes = /* @__PURE__ */ new Map();
const routeSubscribers = /* @__PURE__ */ new Set();
function subscribeToRouteChanges(callback) {
  routeSubscribers.add(callback);
  return () => routeSubscribers.delete(callback);
}
function notifyRouteChanges() {
  routeSubscribers.forEach((callback) => callback());
}
async function reloadRoutes() {
  const { router: newRouter, modulesConfig } = await loadRoutes();
  globalModulesConfig = modulesConfig;
  router.stack = [];
  router.stack.push(...newRouter.stack);
  notifyRouteChanges();
  console.log("\u{1F504} Routes reloaded successfully");
}
async function loadModuleConfig(moduleName) {
  const configTsPath = path.join(modulesPath, moduleName, "config.ts");
  const configJsPath = path.join(modulesPath, moduleName, "config.js");
  console.log(`\u{1F50D} Looking for config in: ${moduleName}`);
  console.log(`   TS path: ${configTsPath}`);
  console.log(`   JS path: ${configJsPath}`);
  let configPath = null;
  if (fs.existsSync(configJsPath)) {
    configPath = configJsPath;
  } else if (fs.existsSync(configTsPath)) {
    configPath = configTsPath;
  } else {
    console.warn(`\u274C Config not found for ${moduleName}`);
    return null;
  }
  try {
    const configUrl = pathToFileURL(configPath).href;
    const configModule = await import(configUrl);
    return configModule.default;
  } catch (err) {
    console.error(`\u274C Failed to load config for module "${moduleName}":`, err);
    return null;
  }
}
async function syncModulesWithConfigs() {
  const moduleNames = fs.readdirSync(modulesPath);
  for (const moduleName of moduleNames) {
    const config = await loadModuleConfig(moduleName.charAt(0).toUpperCase() + moduleName.slice(1).toLowerCase());
    if (config) {
      const existingModule = await ModulesRepository.getModuleByName(config.name);
      const compatibleConfig = {
        name: config.name.charAt(0).toUpperCase() + config.name.slice(1).toLowerCase(),
        path: config.path,
        system: config.system,
        label: config.label ?? existingModule?.label ?? config.name,
        active: config.active ?? existingModule?.active ?? true,
        menu: config.menu ?? existingModule?.menu ?? false,
        actions: config.actions.map((action) => {
          const existingAction = existingModule?.actions.find(
            (a) => a.name === action.name && a.method === action.method.toUpperCase()
          );
          return {
            ...action,
            label: action.label ?? existingAction?.label ?? action.name,
            authorization: action.authorization ?? existingAction?.authorization ?? true,
            active: action.active ?? existingAction?.active ?? true
          };
        })
      };
      await ModulesRepository.syncModuleFromConfig(compatibleConfig);
    }
  }
}
async function getHandlerFromConfig(moduleName, actionName) {
  const config = await loadModuleConfig(moduleName);
  if (!config) return null;
  const action = config.actions.find((a) => a.name === actionName);
  if (!action) return null;
  return {
    handler: action.handler || null,
    middlewares: action.middlewares || []
  };
}
function printRoutesStatistics(allRoutes) {
  console.log("\n\u{1F680} LOADED ROUTES:");
  console.log("===================================");
  const routesByModule = {};
  allRoutes.forEach((route) => {
    if (!routesByModule[route.module]) {
      routesByModule[route.module] = [];
    }
    routesByModule[route.module].push(route);
  });
  Object.entries(routesByModule).forEach(([moduleName, moduleRoutes]) => {
    const isSystemModule = moduleRoutes.some((route) => route.system);
    const isActiveModule = moduleRoutes.some((route) => route.active);
    const isMenuModule = moduleRoutes.some((route) => route.menu);
    const systemMark = isSystemModule ? " [SYSTEM]" : "";
    const activeMark = isActiveModule ? " [ACTIVE]" : " [DISABLED]";
    const menuMark = isMenuModule ? " [MENU]" : "";
    console.log(`${moduleName.toUpperCase()}${systemMark}${activeMark}${menuMark}:`);
    console.log("===================================");
    moduleRoutes.forEach((route) => {
      const authIcon = route.auth ? "\u{1F510}" : "\u{1F441}\uFE0F";
      const activeIcon = route.active ? "\u2705" : "\u274C";
      console.log(`  ${route.method} ${route.path} ${authIcon} ${activeIcon}`);
    });
    console.log("===================================");
  });
  const totalRoutes = allRoutes.length;
  const authRoutes = allRoutes.filter((r) => r.auth).length;
  const publicRoutes = allRoutes.filter((r) => !r.auth).length;
  const activeRoutes = allRoutes.filter((r) => r.active).length;
  const disabledRoutes = allRoutes.filter((r) => !r.active).length;
  console.log("\n\u{1F4CA} STATISTICS:");
  console.log(`Total routes: ${totalRoutes}`);
  console.log(`Auth routes: ${authRoutes} \u{1F510}`);
  console.log(`Public routes: ${publicRoutes} \u{1F441}\uFE0F`);
  console.log(`Active routes: ${activeRoutes} \u2705`);
  console.log(`Disabled routes: ${disabledRoutes} \u274C`);
  console.log("===================================\n");
}
async function loadRoutes() {
  await syncModulesWithConfigs();
  const dbModules = await ModulesRepository.getAllModulesWithActions();
  const modulesConfig = { modules: [] };
  const allRoutes = [];
  for (const dbModule of dbModules) {
    const moduleActive = Boolean(dbModule.active);
    const moduleSystem = Boolean(dbModule.system);
    const moduleMenu = Boolean(dbModule.menu);
    const moduleEntry = {
      name: dbModule.name,
      path: dbModule.path,
      label: dbModule.label,
      system: moduleSystem,
      active: moduleActive,
      menu: moduleMenu,
      actions: []
    };
    modulesConfig.modules.push(moduleEntry);
    for (const dbAction of dbModule.actions) {
      const actionActive = Boolean(dbAction.active);
      const actionAuth = Boolean(dbAction.authorization);
      if (!actionActive) continue;
      const fullPath = "/api" + path.posix.join(dbModule.path, dbAction.path);
      const method = dbAction.method || "get";
      const methodKey = method.toLowerCase();
      const routeHandler = methodMap[methodKey];
      const configData = await getHandlerFromConfig(dbModule.name, dbAction.name);
      if (routeHandler && configData?.handler) {
        const middlewareChain = [];
        if (actionAuth) {
          middlewareChain.push(authMiddleware);
        }
        middlewareChain.push(createModuleActiveMiddleware(moduleActive));
        if (configData.middlewares && configData.middlewares.length > 0) {
          middlewareChain.push(...configData.middlewares);
        }
        middlewareChain.push(createRouteInfoMiddleware(dbModule.name, dbAction.name, actionAuth));
        middlewareChain.push(configData.handler);
        routeHandler(fullPath, ...middlewareChain);
        currentRoutes.set(`${dbModule.name}.${dbAction.name}`, {
          module: dbModule,
          action: dbAction,
          handler: configData.handler,
          middlewares: middlewareChain
        });
        if (consoleOutput) {
          allRoutes.push({
            module: dbModule.name,
            system: moduleSystem,
            active: moduleActive,
            menu: moduleMenu,
            method: method.toUpperCase(),
            path: fullPath,
            auth: actionAuth,
            middlewares: middlewareChain.map((mw) => mw.name || "anonymous")
          });
        }
      }
      moduleEntry.actions.push({
        name: dbAction.name,
        path: dbAction.path,
        label: dbAction.label,
        authorization: actionAuth
      });
    }
    globalModulesConfig = modulesConfig;
  }
  if (consoleOutput) {
    printRoutesStatistics(allRoutes);
  }
  return { router, modulesConfig };
}
export {
  loadRoutes,
  reloadRoutes,
  router,
  subscribeToRouteChanges,
  syncModulesWithConfigs
};
