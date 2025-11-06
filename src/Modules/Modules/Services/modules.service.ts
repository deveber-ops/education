import { Request, Response } from 'express';
import {ModulesRepository} from "../Repositories/modules.repository";
import {reloadRoutes, syncModulesWithConfigs} from "../../../App/Router";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";

export class ModulesService {
    async toggleModule(req: Request, res: Response) {
        try {
            const { moduleName } = req.params;
            const { active } = req.body;

            await ModulesRepository.updateModuleStatus(moduleName, active);
            await reloadRoutes();

            res.json({
                success: true,
                message: `Module ${moduleName} ${active ? 'activated' : 'deactivated'}`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update module status'
            });
        }
    }

    async toggleAction(req: Request, res: Response) {
        try {
            const { moduleName, actionName } = req.params;
            const { active } = req.body;

            await ModulesRepository.updateActionStatus(moduleName, actionName, active);
            await reloadRoutes();

            res.json({
                success: true,
                message: `Action ${actionName} ${active ? 'activated' : 'deactivated'}`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update action status'
            });
        }
    }

    async updateModuleLabel(req: Request, res: Response) {
        try {
            const { moduleName } = req.params;
            const { label } = req.body;

            await ModulesRepository.updateModuleLabel(moduleName, label);
            await reloadRoutes();

            res.json({
                success: true,
                message: `Module label updated to "${label}"`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update module label'
            });
        }
    }

    async updateActionLabel(req: Request, res: Response) {
        try {
            const { moduleName, actionName } = req.params;
            const { label } = req.body;

            await ModulesRepository.updateActionLabel(moduleName, actionName, label);
            await reloadRoutes();

            res.json({
                success: true,
                message: `Action label updated to "${label}"`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update action label'
            });
        }
    }

    async updateModuleMenu(req: Request, res: Response) {
        try {
            const { moduleName } = req.params;
            const { menu } = req.body;

            await ModulesRepository.updateModuleMenu(moduleName, menu);
            await reloadRoutes();

            res.json({
                success: true,
                message: `Module ${menu ? 'added to' : 'removed from'} menu`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update module menu'
            });
        }
    }

    async getModules(res: Response) {
        try {
            const modules = await ModulesRepository.getAllModulesWithActions();
            res.json(modules);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch modules'
            });
        }
    }

    async syncModules(res: Response) {
        try {
            await syncModulesWithConfigs();
            await reloadRoutes();

            res.status(HttpStatus.Ok).json({
                success: true,
                message: 'Modules synchronized successfully'
            });
        } catch (error) {
            console.error('Sync modules error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to sync modules'
            });
        }
    }
}