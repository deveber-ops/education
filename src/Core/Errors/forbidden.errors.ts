export class forbiddenError extends Error {
    field: string;

    constructor(message: string, field: string) {
        super(message);
        this.name = 'forbiddenError';
        this.field = field;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}