import { UsersService } from '../Services/users.service.js';
import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
async function deleteUserHandler(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await UsersService.delete(id);
    res.sendStatus(HttpStatus.Ok);
  } catch (error) {
    next(error);
  }
}
export {
  deleteUserHandler
};
