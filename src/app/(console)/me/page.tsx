import { Main } from "@/components/layout/main";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";
import { Mail, Phone, User as UserIcon, ShieldCheck, Pencil } from "lucide-react";

export default async function Me() {
    const cu = await getCurrentUserServer();
    const u = cu?.id
        ? await db.user.findUnique({
            where: { id: cu.id },
            include: {
                email: true,
                phoneNumber: true,
                membership: { include: { role: true, organization: true } },
                area: {
                    include: {
                        division: { select: { name: true } },
                        district: { select: { name: true } },
                        upazila: { select: { name: true } },
                        union: { select: { name: true } },
                        pollingUnit: { select: { name: true } },
                    },
                },
            },
        })
        : null;

    const fullName = `${u?.firstName ?? cu?.firstName ?? ""} ${u?.lastName ?? cu?.lastName ?? ""}`.trim();
    const email = u?.email?.email ?? cu?.email ?? "—";
    const phone = u?.phoneNumber?.phoneNumber ?? "—";
    const roleName = u?.membership?.role?.name ?? "—";
    const orgName = u?.membership?.organization?.name ?? "—";
    const status = cu?.status ?? "—";
    const nid = (u as any)?.nid ?? "—";
    const areaStr = [
        u?.area?.pollingUnit?.name ?? "",
        u?.area?.union?.name ?? "",
        u?.area?.upazila?.name ?? "",
        u?.area?.district?.name ?? "",
        u?.area?.division?.name ?? "",
    ]
        .filter(Boolean)
        .join(", ") || "—";

    const staffAccount = (email && email.includes("@")) ? email.split("@")[0] : "—";
    const gender = (u as any)?.gender ?? "—";
    const dob = (u as any)?.dateOfBirth ?? "—";
    const hometown = u?.area?.district?.name ?? "—";
    const nationality = (u as any)?.nationality ?? "—";
    const religion = (u as any)?.religion ?? "—";
    const language = (u as any)?.language ?? "—";
    const marital = (u as any)?.maritalStatus ?? "—";
    const permanentAddress = areaStr;
    const currentAddress = areaStr;

    return (
        <Main className="flex flex-col gap-6">
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src="/avatars/shadcn.jpg" alt={fullName || "User"} />
                                <AvatarFallback>{(fullName || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-2xl">{fullName || "User"}</CardTitle>
                                    {cu?.isSuperAdmin && (
                                        <Badge variant="secondary" className="inline-flex items-center gap-1">
                                            <ShieldCheck className="h-3 w-3" /> Super Admin
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription className="text-sm text-primary">{cu?.membership?.role?.name ?? "—"}</CardDescription>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="text-sm">
                                <p className="text-muted-foreground">Staff ID</p>
                                <p className="font-medium">{cu?.id ?? "—"}</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-muted-foreground">Staff Account</p>
                                <p className="font-medium">{staffAccount}</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-muted-foreground">Phone number</p>
                                <p className="font-medium">{phone}</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium">{email}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex items-start justify-between">
                        <div>
                            <CardTitle>Personal information</CardTitle>
                            <CardDescription>Basic profile details</CardDescription>
                        </div>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs text-muted-foreground">Gender</p>
                            <p className="font-medium">{gender}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Date of birth</p>
                            <p className="font-medium">{dob}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Identify code</p>
                            <p className="font-medium">{nid}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Hometown</p>
                            <p className="font-medium">{hometown}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Nationality</p>
                            <p className="font-medium">{nationality}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Religion</p>
                            <p className="font-medium">{religion}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Language</p>
                            <p className="font-medium">{language}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Marital status</p>
                            <p className="font-medium">{marital}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="text-xs text-muted-foreground">Permanent address</p>
                            <p className="font-medium">{permanentAddress}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="text-xs text-muted-foreground">Current address</p>
                            <p className="font-medium">{currentAddress}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex items-start justify-between">
                        <div>
                            <CardTitle>Account information</CardTitle>
                            <CardDescription>Bank and tax details</CardDescription>
                        </div>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs text-muted-foreground">Bank account</p>
                            <p className="font-medium">02520613401</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Account name</p>
                            <p className="font-medium">{fullName || "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Bank</p>
                            <p className="font-medium">TPBank Duy Tan</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Tax code</p>
                            <p className="font-medium">8456120546</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Insurance code</p>
                            <p className="font-medium">8456120546</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Main>
    );
}