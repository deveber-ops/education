export class verificationError extends Error {
    field: string;

    constructor(message: string, field: string) {
        super(message);
        this.name = 'verificationError';
        this.field = field;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}