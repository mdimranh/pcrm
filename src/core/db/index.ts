import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "./client/edge";

const db = new PrismaClient({}).$extends(withAccelerate());
export default db;
