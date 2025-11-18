import db from "@/core/db";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signupSchema } from "./schema";

type SignupData = z.infer<typeof signupSchema>;

interface SignupResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export async function createUser(data: SignupData): Promise<SignupResult> {
  try {
    // Validate data
    const validatedData = signupSchema.parse(data);

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10);

    // Convert gender string to enum
    const genderEnum = validatedData.gender.toUpperCase() as
      | "MALE"
      | "FEMALE"
      | "THIRD_GENDER";

    // Use transaction to create user with all related data
    const result = await db.$transaction(async (tx) => {
      // 1. Create the user
      const user = await tx.user.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          nid: validatedData.nid,
          password: hashedPassword,
          status: "PENDING",
        },
      });

      // 2. Create email record
      await tx.email.create({
        data: {
          email: validatedData.email,
          userId: user.id,
          isVerified: false,
        },
      });

      // 3. Create phone number record
      await tx.phoneNumber.create({
        data: {
          phoneNumber: validatedData.phone,
          userId: user.id,
          isVerified: false,
        },
      });

      // 4. Create gender record (if you have a separate table, otherwise add to user)
      // Assuming gender is stored directly on user, update the user
      await tx.user.update({
        where: { id: user.id },
        data: { gender: genderEnum },
      });

      // 5. Create area record (only if at least divisionId is provided)
      if (validatedData.divisionId) {
        await tx.area.create({
          data: {
            userId: user.id,
            divisionId: validatedData.divisionId,
            districtId: validatedData.districtId || null,
            upazilaId: validatedData.upazilaId || null,
            unionId: validatedData.unionId || null,
            pollingUnitId: validatedData.pollingUnitId || null,
          },
        });
      }

      // 6. Create member record (link user to organization)
      const member = await tx.member.create({
        data: {
          userId: user.id,
          organizationId: validatedData.organizationId,
          roleId: validatedData.designation,
        },
      });

      return { user, member };
    });

    return {
      success: true,
      userId: result.user.id,
    };
  } catch (error) {
    console.error("Error creating user:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((issue) => issue.message).join(", "),
      };
    }

    if (error instanceof Error) {
      // Handle unique constraint violations
      if (error.message.includes("Unique constraint")) {
        if (error.message.includes("email")) {
          return { success: false, error: "Email already exists" };
        }
        if (error.message.includes("nid")) {
          return { success: false, error: "NID already exists" };
        }
        if (error.message.includes("phoneNumber")) {
          return { success: false, error: "Phone number already exists" };
        }
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await createUser(data as SignupData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to sign up. Try again later.",
    });
  }
}
