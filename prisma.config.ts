import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/core/db/schema",
});
