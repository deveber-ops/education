class forbiddenError extends Error {
  field;
  constructor(message, field) {
    super(message);
    this.name = "forbiddenError";
    this.field = field;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export {
  forbiddenError
};
