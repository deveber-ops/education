import express from 'express';
import {setupApp} from "./App/Setup";

const app = express();

(async () => {
    try {
        await setupApp(app);

        const PORT = process.env.PORT ? Number(process.env.PORT) : 80;

        app.listen(PORT, () => {
            console.log(`🚀 App running on port:${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Failed to start application:', error);
        process.exit(1);
    }
})();

export { app };