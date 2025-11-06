import { ModulesRepository } from '../Repositories/modules.repository.js';
import { reloadRoutes, syncModulesWithConfigs } from '../../../App/Router.js';
import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
class ModulesService {
  async toggleModule(req, res) {
    try {
      const { moduleName } = req.params;
      const { active } = req.body;
      await ModulesRepository.updateModuleStatus(moduleName, active);
      await reloadRoutes();
      res.json({
        success: true,
        message: `Module ${moduleName} ${active ? "activated" : "deactivated"}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update module status"
      });
    }
  }
  async toggleAction(req, res) {
    try {
      const { moduleName, actionName } = req.params;
      const { active } = req.body;
      await ModulesRepository.updateActionStatus(moduleName, actionName, active);
      await reloadRoutes();
      res.json({
        success: true,
        message: `Action ${actionName} ${active ? "activated" : "deactivated"}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update action status"
      });
    }
  }
  async updateModuleLabel(req, res) {
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
        message: "Failed to update module label"
      });
    }
  }
  async updateActionLabel(req, res) {
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
        message: "Failed to update action label"
      });
    }
  }
  async updateModuleMenu(req, res) {
    try {
      const { moduleName } = req.params;
      const { menu } = req.body;
      await ModulesRepository.updateModuleMenu(moduleName, menu);
      await reloadRoutes();
      res.json({
        success: true,
        message: `Module ${menu ? "added to" : "removed from"} menu`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update module menu"
      });
    }
  }
  async getModules(res) {
    try {
      const modules = await ModulesRepository.getAllModulesWithActions();
      res.json(modules);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch modules"
      });
    }
  }
  async syncModules(res) {
    try {
      await syncModulesWithConfigs();
      await reloadRoutes();
      res.status(HttpStatus.Ok).json({
        success: true,
        message: "Modules synchronized successfully"
      });
    } catch (error) {
      console.error("Sync modules error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to sync modules"
      });
    }
  }
}
export {
  ModulesService
};
