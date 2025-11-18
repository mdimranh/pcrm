"use server";
import db from "@/core/db";

export async function getDivision() {
  const divisions = await db.division.findMany();
  return divisions;
}

export async function getDistrict(divisionId: string) {
  const districts = await db.district.findMany({
    where: { divisionId: divisionId },
  });
  return districts;
}

export async function getUpazila(districtId: string) {
  const upazilas = await db.upazila.findMany({
    where: { districtId: districtId },
  });
  return upazilas;
}

export async function getUnion(upazilaId: string) {
  const unions = await db.union.findMany({
    where: { upazilaId: upazilaId },
  });
  return unions;
}

export async function getPollingUnit(unionId: string) {
  const pollingUnits = await db.polling_unit.findMany({
    where: { unionId: unionId },
  });
  return pollingUnits;
}

export async function signUp(data: any) {
  try {
    const user = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!user.ok) {
      throw new Error("Failed to sign up. Try again later.");
    }
    const res = (await user.json()) as {
      success: boolean;
      error?: string;
    };
    if (res.success) {
      return { success: true, message: "User signed up successfully." };
    } else {
      throw new Error(res.error || "Failed to sign up. Try again later.");
    }
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign up. Try again later.");
  }
}
