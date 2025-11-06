import { UsersService } from '../Services/users.service.js';
import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
async function createUserHandler(req, res, next) {
  try {
    const createdUser = await UsersService.create(req.body);
    res.status(HttpStatus.Created).send(createdUser);
  } catch (error) {
    next(error);
  }
}
export {
  createUserHandler
};
