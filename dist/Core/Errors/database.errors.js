class DatabaseConnectionError extends Error {
  code;
  constructor(message, originalError) {
    super(message);
    this.name = "DatabaseConnectionError";
    this.code = "DATABASE_CONNECTION_ERROR";
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}
export {
  DatabaseConnectionError
};
