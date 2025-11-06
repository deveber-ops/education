import 'express';

declare global {
    namespace Express {
        interface Request {
            clientType?:
                | 'api'
                | 'browser'
                | 'xml'
                | 'text'
                | 'pdf'
                | 'image'
                | 'binary'
                | 'form'
                | 'unknown';
        }
    }
}

declare global {
    namespace Express {
        interface Request {
            userId: string | null;
        }
    }
}