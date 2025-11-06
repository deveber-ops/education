import express from "express";
import { setupApp } from './App/Setup.js';
const app = express();
(async () => {
  try {
    await setupApp(app);
    const PORT = process.env.PORT ? Number(process.env.PORT) : 80;
    app.listen(PORT, () => {
      console.log(`\u{1F680} App running on port:${PORT}`);
      console.log(`\u{1F4CA} Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("\u274C Failed to start application:", error);
    process.exit(1);
  }
})();
export {
  app
};
