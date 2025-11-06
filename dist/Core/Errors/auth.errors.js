class authError extends Error {
  field;
  constructor(message, field) {
    super(message);
    this.name = "authError";
    this.field = field;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export {
  authError
};
