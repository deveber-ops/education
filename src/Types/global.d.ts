import 'express';

declare global {
    namespace Express {
        interface Request {
            userInfo?: {
                userId: number,
                email: string,
                login: string
            };
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