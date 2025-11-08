var HttpStatus = /* @__PURE__ */ ((HttpStatus2) => {
  HttpStatus2[HttpStatus2["Ok"] = 200] = "Ok";
  HttpStatus2[HttpStatus2["Created"] = 201] = "Created";
  HttpStatus2[HttpStatus2["NoContent"] = 204] = "NoContent";
  HttpStatus2[HttpStatus2["BadRequest"] = 400] = "BadRequest";
  HttpStatus2[HttpStatus2["Unauthorized"] = 401] = "Unauthorized";
  HttpStatus2[HttpStatus2["Forbidden"] = 403] = "Forbidden";
  HttpStatus2[HttpStatus2["NotFound"] = 404] = "NotFound";
  HttpStatus2[HttpStatus2["Conflict"] = 409] = "Conflict";
  HttpStatus2[HttpStatus2["UnprocessableEntity"] = 422] = "UnprocessableEntity";
  HttpStatus2[HttpStatus2["Locked"] = 423] = "Locked";
  HttpStatus2[HttpStatus2["TooManyRequests"] = 429] = "TooManyRequests";
  HttpStatus2[HttpStatus2["InternalServerError"] = 500] = "InternalServerError";
  HttpStatus2[HttpStatus2["ServiceUnavailable"] = 503] = "ServiceUnavailable";
  return HttpStatus2;
})(HttpStatus || {});
export {
  HttpStatus
};
