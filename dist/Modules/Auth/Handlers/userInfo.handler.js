import { HttpStatus } from '../../../Core/Types/httpStatuses.enum.js';
const userInfoHandler = async (req, res, next) => {
  try {
    return res.status(HttpStatus.Ok).json(req.userInfo);
  } catch (error) {
    next(error);
  }
};
export {
  userInfoHandler
};
