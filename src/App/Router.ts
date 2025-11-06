import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { HttpStatus } from "../Core/Types/httpStatuses.enum";
import cookieParser from "cookie-parser";
import {detectClientTypeMiddleware} from "../Core/Middlewares/detectClientType.middleware";
import {ModulesRepository} from "../Modules/Modules/Repositories/modules.repository";
import {authMiddleware} from "../Modules/Auth/Middlewares/auth.middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ActionConfig {
    method: string;
    name: string;
    path: string;
    label?: string;
    authorization?: boolean;
    active?: boolean;
    middlewares?: express.RequestHandler[];
    handler?: express.RequestHandler;
}

interface ModuleConfig {
    name: string;
    path: string;
    system: boolean;
    label?: string;
    active?: boolean;
    menu?: boolean;
    actions: ActionConfig[];
}

interface AggregatedConfig {
    modules: {
        name: string;
        path: string;
        label: string;
        system: boolean;
        active: boolean;
        menu: boolean;
        actions: {
            name: string;
            path: string;
            label: string;
            authorization: boolean;
        }[];
    }[];
}

const modulesPath = path.resolve(__dirname, '../modules');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(detectClientTypeMiddleware);
const consoleOutput = true;

let globalModulesConfig: AggregatedConfig = { modules: [] };

const methodMap = {
    get: router.get.bind(router),
    post: router.post.bind(router),
    put: router.put.bind(router),
    delete: router.delete.bind(router),
    patch: router.patch.bind(router),
} as const;

function createModuleActiveMiddleware(moduleActive: boolean): express.RequestHandler {
    return (_req: Request, res: Response, next: NextFunction) => {
        if (!moduleActive) {
            return res.status(HttpStatus.Locked).json({
                error: 'MODULE_DISABLED',
                message: 'Модуль временно отключен.'
            });
        }
        next();
    };
}

function createRouteInfoMiddleware(moduleName: string, actionName: string, actionAuth: boolean): express.RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        res.locals.routeInfo = {
            module: moduleName,
            action: {
                [actionName]: { auth: actionAuth }
            },
        };
        next();
    };
}

let currentRoutes = new Map<string, any>();
const routeSubscribers = new Set<() => void>();

export function subscribeToRouteChanges(callback: () => void) {
    routeSubscribers.add(callback);
    return () => routeSubscribers.delete(callback);
}

function notifyRouteChanges() {
    routeSubscribers.forEach(callback => callback());
}

export async function reloadRoutes(): Promise<void> {
    const { router: newRouter, modulesConfig } = await loadRoutes();

    globalModulesConfig = modulesConfig;

    router.stack = [];

    router.stack.push(...newRouter.stack);

    notifyRouteChanges();
    console.log('🔄 Routes reloaded successfully');
}

async function loadModuleConfig(moduleName: string): Promise<ModuleConfig | null> {
    const configTsPath = path.join(modulesPath, moduleName, 'config.ts');
    const configJsPath = path.join(modulesPath, moduleName, 'config.js');

    let configPath: string | null = null;

    if (fs.existsSync(configJsPath)) {
        configPath = configJsPath;
    } else if (fs.existsSync(configTsPath)) {
        configPath = configTsPath;
    } else {
        console.warn(`❌ Config not found for ${moduleName}`);
        return null;
    }

    try {
        const configUrl = pathToFileURL(configPath).href;
        const configModule = await import(configUrl);
        return configModule.default;
    } catch (err) {
        console.error(`❌ Failed to load config for module "${moduleName}":`, err);
        return null;
    }
}

export async function syncModulesWithConfigs(): Promise<void> {
    const moduleNames = fs.readdirSync(modulesPath);

    for (const moduleName of moduleNames) {
        const config = await loadModuleConfig(moduleName);
        if (config) {
            const existingModule = await ModulesRepository.getModuleByName(config.name);

            const compatibleConfig = {
                name: config.name,
                path: config.path,
                system: config.system,
                label: config.label ?? existingModule?.label ?? config.name,
                active: config.active ?? existingModule?.active ?? true,
                menu: config.menu ?? existingModule?.menu ?? false,
                actions: config.actions.map(action => {
                    const existingAction = existingModule?.actions.find(a =>
                        a.name === action.name && a.method === action.method.toUpperCase()
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

async function getHandlerFromConfig(moduleName: string, actionName: string): Promise<{
    handler: express.RequestHandler | null;
    middlewares: express.RequestHandler[];
} | null> {
    const config = await loadModuleConfig(moduleName);
    if (!config) return null;

    const action = config.actions.find(a => a.name === actionName);
    if (!action) return null;

    return {
        handler: action.handler || null,
        middlewares: action.middlewares || []
    };
}

function printRoutesStatistics(allRoutes: Array<{
    module: string;
    system: boolean;
    active: boolean;
    menu: boolean;
    method: string;
    path: string;
    auth: boolean;
    middlewares: string[];
}>): void {
    console.log('\n🚀 LOADED ROUTES:');
    console.log('===================================');

    const routesByModule: Record<string, typeof allRoutes> = {};

    allRoutes.forEach(route => {
        if (!routesByModule[route.module]) {
            routesByModule[route.module] = [];
        }
        routesByModule[route.module].push(route);
    });

    Object.entries(routesByModule).forEach(([moduleName, moduleRoutes]) => {
        const isSystemModule = moduleRoutes.some(route => route.system);
        const isActiveModule = moduleRoutes.some(route => route.active);
        const isMenuModule = moduleRoutes.some(route => route.menu);

        const systemMark = isSystemModule ? ' [SYSTEM]' : '';
        const activeMark = isActiveModule ? ' [ACTIVE]' : ' [DISABLED]';
        const menuMark = isMenuModule ? ' [MENU]' : '';

        console.log(`${moduleName.toUpperCase()}${systemMark}${activeMark}${menuMark}:`);
        console.log('===================================');

        moduleRoutes.forEach(route => {
            const authIcon = route.auth ? '🔐' : '👁️';
            const activeIcon = route.active ? '✅' : '❌';
            console.log(`  ${route.method} ${route.path} ${authIcon} ${activeIcon}`);
        });
        console.log('===================================');
    });

    // Статистика
    const totalRoutes = allRoutes.length;
    const authRoutes = allRoutes.filter(r => r.auth).length;
    const publicRoutes = allRoutes.filter(r => !r.auth).length;
    const activeRoutes = allRoutes.filter(r => r.active).length;
    const disabledRoutes = allRoutes.filter(r => !r.active).length;

    console.log('\n📊 STATISTICS:');
    console.log(`Total routes: ${totalRoutes}`);
    console.log(`Auth routes: ${authRoutes} 🔐`);
    console.log(`Public routes: ${publicRoutes} 👁️`);
    console.log(`Active routes: ${activeRoutes} ✅`);
    console.log(`Disabled routes: ${disabledRoutes} ❌`);
    console.log('===================================\n');
}

export async function loadRoutes(): Promise<{ router: express.Router; modulesConfig: AggregatedConfig }> {
    await syncModulesWithConfigs();

    const dbModules = await ModulesRepository.getAllModulesWithActions();

    const modulesConfig: AggregatedConfig = { modules: [] };
    const allRoutes: Array<{
        module: string;
        system: boolean;
        active: boolean;
        menu: boolean;
        method: string;
        path: string;
        auth: boolean;
        middlewares: string[];
    }> = [];

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
            actions: [] as {
                name: string;
                path: string;
                label: string;
                authorization: boolean;
            }[]
        };

        modulesConfig.modules.push(moduleEntry);

        for (const dbAction of dbModule.actions) {
            const actionActive = Boolean(dbAction.active);
            const actionAuth = Boolean(dbAction.authorization);

            if (!actionActive) continue;

            const fullPath = '/api' + path.posix.join(dbModule.path, dbAction.path);
            const method = dbAction.method || 'get';
            const methodKey = method.toLowerCase() as keyof typeof methodMap;
            const routeHandler = methodMap[methodKey];

            const configData = await getHandlerFromConfig(dbModule.name, dbAction.name);

            if (routeHandler && configData?.handler) {
                const middlewareChain: express.RequestHandler[] = [];

                middlewareChain.push(createModuleActiveMiddleware(moduleActive));

                if (configData.middlewares && configData.middlewares.length > 0) {
                    middlewareChain.push(...configData.middlewares);
                }

                middlewareChain.push(createRouteInfoMiddleware(dbModule.name, dbAction.name, actionAuth));

                if (actionAuth) {
                    middlewareChain.push(authMiddleware);
                }

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
                        middlewares: middlewareChain.map(mw => mw.name || 'anonymous')
                    });
                }
            }

            moduleEntry.actions.push({
                name: dbAction.name,
                path: dbAction.path,
                label: dbAction.label,
                authorization: actionAuth,
            });
        }
        globalModulesConfig = modulesConfig;
    }

    if (consoleOutput) {
        printRoutesStatistics(allRoutes);
    }

    return { router, modulesConfig };
}

export { router };