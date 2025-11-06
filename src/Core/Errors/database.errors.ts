export class DatabaseConnectionError extends Error {
    public readonly code: string;

    constructor(message: string, originalError?: any) {
        super(message);
        this.name = 'DatabaseConnectionError';
        this.code = 'DATABASE_CONNECTION_ERROR';

        if (originalError) {
            this.stack = originalError.stack;
        }
    }
}