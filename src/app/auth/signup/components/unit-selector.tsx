"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  getDistrict,
  getDivision,
  getPollingUnit,
  getUnion,
  getUpazila,
} from "../actions";

export function UnitSelector({ setValue, form }: { setValue: any; form: any }) {
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>(
    []
  );
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    []
  );
  const [upazilas, setUpazilas] = useState<{ id: string; name: string }[]>([]);
  const [unions, setUnions] = useState<{ id: string; name: string }[]>([]);
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);

  // Load divisions initially
  useEffect(() => {
    async function loadDivisions() {
      const divisions = await getDivision();
      setDivisions(divisions);
    }
    loadDivisions();
  }, []);

  async function handleDivision(id: string) {
    setValue("divisionId", id);
    const districts = await getDistrict(id);
    setDistricts(districts);

    setUpazilas([]);
    setUnions([]);
    setUnits([]);
  }

  async function handleDistrict(id: string) {
    setValue("districtId", id);
    const upazilas = await getUpazila(id);
    setUpazilas(upazilas);

    setUnions([]);
    setUnits([]);
  }

  async function handleUpazila(id: string) {
    setValue("upazilaId", id);
    const unions = await getUnion(id);
    setUnions(unions);

    setUnits([]);
  }

  async function handleUnion(id: string) {
    setValue("unionId", id);
    const units = await getPollingUnit(id);
    setUnits(units);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Division</FieldLabel>
          {/* District */}
          <Select
            onValueChange={(value) => {
              handleDivision(value);
            }}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                {" "}
                {/* ✅ Add here */}
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {divisions.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="checkout-7j9-exp-year-f59">District</FieldLabel>
          {/* District */}
          <Select onValueChange={handleDistrict} disabled={!districts.length}>
            <SelectTrigger>
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="checkout-exp-month-ts6">Upazila</FieldLabel>
          {/* Upazila */}
          <Select onValueChange={handleUpazila} disabled={!upazilas.length}>
            <SelectTrigger>
              <SelectValue placeholder="Select Upazila / Paurashava" />
            </SelectTrigger>
            <SelectContent>
              {upazilas.map((u) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
            Union / Ward
          </FieldLabel>
          {/* Union / Ward */}
          <Select onValueChange={handleUnion} disabled={!unions.length}>
            <SelectTrigger>
              <SelectValue placeholder="Select Union / Ward" />
            </SelectTrigger>
            <SelectContent>
              {unions.map((u) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
          Polling Unit
        </FieldLabel>
        {/* Polling Unit */}
        <Select
          onValueChange={(id) => setValue("pollingUnitId", id)}
          disabled={!units.length}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Polling Station / Unit" />
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
