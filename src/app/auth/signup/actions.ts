"use server";
import db from "@/core/db";

const CACHE_TTL_MS = 10 * 60 * 1000
const now = () => Date.now()
const isFresh = (ts: number) => now() - ts < CACHE_TTL_MS

let divisionsCache: { data: any[]; ts: number } | null = null
const districtsCache = new Map<string, { data: any[]; ts: number }>()
const upazilasCache = new Map<string, { data: any[]; ts: number }>()
const unionsCache = new Map<string, { data: any[]; ts: number }>()
const pollingUnitsCache = new Map<string, { data: any[]; ts: number }>()

export async function getDivision() {
  if (divisionsCache && isFresh(divisionsCache.ts)) {
    return divisionsCache.data
  }
  const divisions = await db.division.findMany()
  divisionsCache = { data: divisions, ts: now() }
  return divisions
}

export async function getDistrict(divisionId: string) {
  const cached = districtsCache.get(divisionId)
  if (cached && isFresh(cached.ts)) return cached.data
  const districts = await db.district.findMany({
    where: { divisionId: divisionId },
  })
  districtsCache.set(divisionId, { data: districts, ts: now() })
  return districts
}

export async function getUpazila(districtId: string) {
  const cached = upazilasCache.get(districtId)
  if (cached && isFresh(cached.ts)) return cached.data
  const upazilas = await db.upazila.findMany({
    where: { districtId: districtId },
  })
  upazilasCache.set(districtId, { data: upazilas, ts: now() })
  return upazilas
}

export async function getUnion(upazilaId: string) {
  const cached = unionsCache.get(upazilaId)
  if (cached && isFresh(cached.ts)) return cached.data
  const unions = await db.union.findMany({
    where: { upazilaId: upazilaId },
  })
  unionsCache.set(upazilaId, { data: unions, ts: now() })
  return unions
}

export async function getPollingUnit(unionId: string) {
  const cached = pollingUnitsCache.get(unionId)
  if (cached && isFresh(cached.ts)) return cached.data
  const pollingUnits = await db.polling_unit.findMany({
    where: { unionId: unionId },
  })
  pollingUnitsCache.set(unionId, { data: pollingUnits, ts: now() })
  return pollingUnits
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
