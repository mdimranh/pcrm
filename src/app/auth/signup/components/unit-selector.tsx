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

export function UnitSelector({ setValue, form, setLoading }: { setValue: any; form: any, setLoading: (loading: boolean) => void }) {
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>(
    []
  );
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    []
  );
  const [upazilas, setUpazilas] = useState<{ id: string; name: string }[]>([]);
  const [unions, setUnions] = useState<{ id: string; name: string }[]>([]);
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load divisions initially
  useEffect(() => {
    async function loadDivisions() {
      const divisions = await getDivision();
      setDivisions(divisions);
    }
    loadDivisions();
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      setLoading(false);
    };
  }, [isInitializing]);

  useEffect(() => {
    async function initFromFormDefaults() {
      setIsInitializing(true);
      try {
        const divisionId = form?.getValues?.("divisionId");
        const districtId = form?.getValues?.("districtId");
        const upazilaId = form?.getValues?.("upazilaId");
        const unionId = form?.getValues?.("unionId");
        if (divisionId) {
          setValue("divisionId", divisionId);
          const districts = await getDistrict(divisionId);
          setDistricts(districts);
          if (districtId) {
            setValue("districtId", districtId);
            const upazilas = await getUpazila(districtId);
            setUpazilas(upazilas);
            if (upazilaId) {
              setValue("upazilaId", upazilaId);
              const unions = await getUnion(upazilaId);
              setUnions(unions);
              if (unionId) {
                setValue("unionId", unionId);
                const units = await getPollingUnit(unionId);
                setUnits(units);
              }
            }
          }
        }
      } finally {
        setIsInitializing(false);
      }
    }
    initFromFormDefaults();
  }, [form]);

  async function handleDivision(id: string) {
    setLoading(true);
    setValue("divisionId", id);
    const districts = await getDistrict(id);
    setDistricts(districts);
    setUpazilas([]);
    setUnions([]);
    setUnits([]);
    setLoading(false);
  }

  async function handleDistrict(id: string) {
    setLoading(true);
    setValue("districtId", id);
    const upazilas = await getUpazila(id);
    setUpazilas(upazilas);
    setUnions([]);
    setUnits([]);
    setLoading(false);
  }

  async function handleUpazila(id: string) {
    setLoading(true);
    setValue("upazilaId", id);
    const unions = await getUnion(id);
    setUnions(unions);
    setUnits([]);
    setLoading(false);
  }

  async function handleUnion(id: string) {
    setLoading(true);
    setValue("unionId", id);
    const units = await getPollingUnit(id);
    setUnits(units);
    setLoading(false);
  }

  return (
    <div className="space-y-4 relative">
      <div className={`grid grid-cols-2 gap-4`}>
        <Field>
          <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Division</FieldLabel>
          {/* District */}
          <Select
            defaultValue={form?.getValues?.("divisionId") ?? undefined}
            onValueChange={(value) => {
              handleDivision(value);
            }}
            disabled={isInitializing}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                {" "}
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
          <Select defaultValue={form?.getValues?.("districtId") ?? undefined} onValueChange={handleDistrict} disabled={isInitializing || !districts.length}>
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
          <Select defaultValue={form?.getValues?.("upazilaId") ?? undefined} onValueChange={handleUpazila} disabled={isInitializing || !upazilas.length}>
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
          <Select defaultValue={form?.getValues?.("unionId") ?? undefined} onValueChange={handleUnion} disabled={isInitializing || !unions.length}>
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
          defaultValue={form?.getValues?.("pollingUnitId") ?? undefined}
          onValueChange={(id) => setValue("pollingUnitId", id)}
          disabled={isInitializing || !units.length}
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
