import { area } from "@/core/db/client";

export function userReagion(area: area = {} as area) {
    if (area.pollingUnitId) return {
        label: "Polling Unit",
        key: "pollingUnitId",
    };
    if (area.unionId) return {
        label: "Union",
        key: "unionId",
    };
    if (area.upazilaId) return {
        label: "Upazila",
        key: "upazilaId",
    };
    if (area.districtId) return {
        label: "District",
        key: "districtId",
    };
    if (area.divisionId) return {
        label: "Division",
        key: "divisionId",
    };
    return {
        label: "Central",
        key: "central",
    };
}