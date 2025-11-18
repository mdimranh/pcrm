import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "./client/edge";

const db = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
}).$extends(withAccelerate());
export default db;
