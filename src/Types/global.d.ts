import 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: number;
            clientType?: string;
            isVerified?: boolean;
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