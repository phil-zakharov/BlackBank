import { buildApp } from "./server";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 3000;

async function start() {
  const app = buildApp();

  try {
    await app.listen({ port, host: "0.0.0.0" });
    // eslint-disable-next-line no-console
    console.log(`BlackBank API running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

