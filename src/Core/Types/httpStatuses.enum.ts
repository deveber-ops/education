export enum HttpStatus {
    Ok = 200,
    Created = 201,
    NoContent = 204,

    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    UnprocessableEntity = 422,
    Locked = 423,
    TooManyRequests = 429,

    InternalServerError = 500,
    ServiceUnavailable = 503,
}