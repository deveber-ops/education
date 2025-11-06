export class authError extends Error {
    field: string;

    constructor(message: string, field: string) {
        super(message);
        this.name = 'authError';
        this.field = field;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}