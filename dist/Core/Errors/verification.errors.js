class verificationError extends Error {
  field;
  constructor(message, field) {
    super(message);
    this.name = "verificationError";
    this.field = field;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export {
  verificationError
};
