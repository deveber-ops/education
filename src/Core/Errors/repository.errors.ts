export class repositoryNotFoundError extends Error {
    field: string;

    constructor(message: string, field: string) {
        super(message);
        this.name = 'repositoryNotFoundError';
        this.field = field;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class repositoryUniqueError extends Error {
    field: string;

    constructor(message: string, field: string) {
        super(message);
        this.name = 'repositoryUniqueError';
        this.field = field;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}