// create signup schema using zod
import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().min(1, "Please enter your last name"),
  email: z.email({
    error: (iss) => (iss.input === "" ? "Please enter your email" : undefined),
  }),
  phone: z.string().length(11, "Phone number must be 11 digits"),
  nid: z
    .string()
    .min(10, "NID must be at least 10 digits")
    .max(17, "NID must be at most 17 digits"),
  gender: z.string().min(1, "Please select your gender"),
  password: z
    .string()
    .min(1, "Please enter your password")
    .min(7, "Password must be at least 7 characters long"),
  organizationId: z.string().min(1, "Please select your organization"),
  divisionId: z.string().optional(),
  districtId: z.string().optional(),
  upazilaId: z.string().optional(),
  unionId: z.string().optional(),
  pollingUnitId: z.string().optional(),
  designation: z.string().min(1, "Please select your designation"),
});
