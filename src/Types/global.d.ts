import 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: number;
            clientType?: string;
        }

        interface Response {
            locals: {
                routeInfo?: {
                    module: string;
                    action: {
                        [actionName: string]: {
                            auth: boolean;
                        };
                    };
                };
            };
        }
    }
}

export {};