"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Organization } from "@/core/db/client";
import { useState } from "react";
export function OrgSelector({
  organizations,
  fetching,
  setValue,
  form,
}: {
  organizations: Organization[];
  fetching: boolean;
  setValue: any;
  form: any;
}) {
  const [selectedOrganization, setSelectedOrganization] = useState("");
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          Select Your Organization
        </h2>
        <p className="text-gray-600">
          Choose the organization type you're registering with
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {fetching ? (
          <>
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="p-6 rounded-lg border-2 bg-primary-foreground"
              >
                <div className="flex justify-center flex-col items-center">
                  <div className="mb-3">
                    <Skeleton className="h-12 w-12 rounded" />
                  </div>
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {" "}
            {organizations.map((org) => (
              <button
                type="button"
                key={org.id}
                onClick={() => {
                  setSelectedOrganization(org.id);
                  setValue("organizationId", org.id, {
                    shouldDirty: true,
                    shouldValidate: true,
                    shouldTouch: true,
                  });
                }}
                className={`p-3 rounded-lg border-2 transition-all hover:shadow-md bg-primary-foreground ${
                  form.getValues("organizationId") === org.id
                    ? "border-primary"
                    : ""
                }`}
              >
                <div className="flex justify-center flex-col items-center">
                  <div className="text-4xl mb-3">
                    <img src={org.logo || ""} className="h-12 w-12" />
                  </div>
                  <div className="font-semibold text-primary">{org.name}</div>
                </div>
              </button>
            ))}
          </>
        )}
      </div>
      {/* {errors.organization && (
        <p className="text-red-500 text-sm">{errors.organization}</p>
      )} */}
    </div>
  );
}
