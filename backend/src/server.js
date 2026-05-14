const { app } = require("./app");
const { env } = require("./config/env");
const { initializeDatabase } = require("./db/database");

async function bootstrap() {
  await initializeDatabase();

  app.listen(env.port, () => {
    console.log(
      `Backend running on http://localhost:${env.port}${env.apiPrefix}`
    );
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
