class repositoryNotFoundError extends Error {
  field;
  constructor(message, field) {
    super(message);
    this.name = "repositoryNotFoundError";
    this.field = field;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
class repositoryUniqueError extends Error {
  field;
  constructor(message, field) {
    super(message);
    this.name = "repositoryUniqueError";
    this.field = field;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export {
  repositoryNotFoundError,
  repositoryUniqueError
};
