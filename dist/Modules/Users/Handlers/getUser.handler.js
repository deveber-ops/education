import { UsersService } from '../Services/users.service.js';
async function getUserHandler(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await UsersService.findOne(id);
    res.send(user);
  } catch (error) {
    next(error);
  }
}
export {
  getUserHandler
};
