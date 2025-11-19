// src/core/db/seed.ts
import { PrismaClient } from "./client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // -----------------------------
  // Divisions
  // -----------------------------
  const divisions = [
    { id: "dhaka-div", name: "Dhaka" },
    { id: "chattogram-div", name: "Chattogram" },
    { id: "rajshahi-div", name: "Rajshahi" },
    { id: "khulna-div", name: "Khulna" },
    { id: "barishal-div", name: "Barishal" },
    { id: "sylhet-div", name: "Sylhet" },
    { id: "rangpur-div", name: "Rangpur" },
    { id: "mymensingh-div", name: "Mymensingh" },
  ];

  for (const d of divisions) {
    await prisma.division.upsert({
      where: { id: d.id },
      update: {},
      create: d,
    });
  }

  // -----------------------------
  // Districts
  // -----------------------------
  const districts = [
    // Dhaka Division
    { id: "dhaka-dist", name: "Dhaka", divisionId: "dhaka-div" },
    { id: "gazipur-dist", name: "Gazipur", divisionId: "dhaka-div" },
    { id: "kishoreganj-dist", name: "Kishoreganj", divisionId: "dhaka-div" },
    { id: "manikganj-dist", name: "Manikganj", divisionId: "dhaka-div" },
    { id: "munshiganj-dist", name: "Munshiganj", divisionId: "dhaka-div" },
    { id: "narayanganj-dist", name: "Narayanganj", divisionId: "dhaka-div" },
    { id: "narsingdi-dist", name: "Narsingdi", divisionId: "dhaka-div" },
    { id: "tangail-dist", name: "Tangail", divisionId: "dhaka-div" },
    { id: "faridpur-dist", name: "Faridpur", divisionId: "dhaka-div" },
    { id: "gopalganj-dist", name: "Gopalganj", divisionId: "dhaka-div" },
    { id: "madaripur-dist", name: "Madaripur", divisionId: "dhaka-div" },
    { id: "rajbari-dist", name: "Rajbari", divisionId: "dhaka-div" },
    { id: "shariatpur-dist", name: "Shariatpur", divisionId: "dhaka-div" },

    // Chattogram Division
    { id: "chattogram-dist", name: "Chattogram", divisionId: "chattogram-div" },
    { id: "coxsbazar-dist", name: "Cox's Bazar", divisionId: "chattogram-div" },
    { id: "cumilla-dist", name: "Cumilla", divisionId: "chattogram-div" },
    { id: "bandarban-dist", name: "Bandarban", divisionId: "chattogram-div" },
    {
      id: "brahmanbaria-dist",
      name: "Brahmanbaria",
      divisionId: "chattogram-div",
    },
    { id: "chandpur-dist", name: "Chandpur", divisionId: "chattogram-div" },
    { id: "feni-dist", name: "Feni", divisionId: "chattogram-div" },
    {
      id: "khagrachhari-dist",
      name: "Khagrachhari",
      divisionId: "chattogram-div",
    },
    { id: "lakshmipur-dist", name: "Lakshmipur", divisionId: "chattogram-div" },
    { id: "noakhali-dist", name: "Noakhali", divisionId: "chattogram-div" },
    { id: "rangamati-dist", name: "Rangamati", divisionId: "chattogram-div" },

    // Rajshahi Division
    { id: "bogura-dist", name: "Bogura", divisionId: "rajshahi-div" },
    { id: "chapai-dist", name: "Chapai Nawabganj", divisionId: "rajshahi-div" },
    { id: "jaipurhat-dist", name: "Jaipurhat", divisionId: "rajshahi-div" },
    { id: "naogaon-dist", name: "Naogaon", divisionId: "rajshahi-div" },
    { id: "natore-dist", name: "Natore", divisionId: "rajshahi-div" },
    { id: "pabna-dist", name: "Pabna", divisionId: "rajshahi-div" },
    { id: "rajshahi-dist", name: "Rajshahi", divisionId: "rajshahi-div" },
    { id: "sirajganj-dist", name: "Sirajganj", divisionId: "rajshahi-div" },

    // Khulna Division
    { id: "bagerhat-dist", name: "Bagerhat", divisionId: "khulna-div" },
    { id: "chuadanga-dist", name: "Chuadanga", divisionId: "khulna-div" },
    { id: "jashore-dist", name: "Jashore", divisionId: "khulna-div" },
    { id: "jhenaidah-dist", name: "Jhenaidah", divisionId: "khulna-div" },
    { id: "khulna-dist", name: "Khulna", divisionId: "khulna-div" },
    { id: "kushtia-dist", name: "Kushtia", divisionId: "khulna-div" },
    { id: "magura-dist", name: "Magura", divisionId: "khulna-div" },
    { id: "meherpur-dist", name: "Meherpur", divisionId: "khulna-div" },
    { id: "narail-dist", name: "Narail", divisionId: "khulna-div" },
    { id: "satkhira-dist", name: "Satkhira", divisionId: "khulna-div" },

    // Barishal Division
    { id: "barishal-dist", name: "Barishal", divisionId: "barishal-div" },
    { id: "bhola-dist", name: "Bhola", divisionId: "barishal-div" },
    { id: "jhalokathi-dist", name: "Jhalokathi", divisionId: "barishal-div" },
    { id: "patuakhali-dist", name: "Patuakhali", divisionId: "barishal-div" },
    { id: "pirojpur-dist", name: "Pirojpur", divisionId: "barishal-div" },

    // Sylhet Division
    { id: "habiganj-dist", name: "Habiganj", divisionId: "sylhet-div" },
    { id: "moulvibazar-dist", name: "Moulvibazar", divisionId: "sylhet-div" },
    { id: "sunamganj-dist", name: "Sunamganj", divisionId: "sylhet-div" },
    { id: "sylhet-dist", name: "Sylhet", divisionId: "sylhet-div" },

    // Rangpur Division
    { id: "dinajpur-dist", name: "Dinajpur", divisionId: "rangpur-div" },
    { id: "gaibandha-dist", name: "Gaibandha", divisionId: "rangpur-div" },
    { id: "kurigram-dist", name: "Kurigram", divisionId: "rangpur-div" },
    { id: "lalmonirhat-dist", name: "Lalmonirhat", divisionId: "rangpur-div" },
    { id: "nilphamari-dist", name: "Nilphamari", divisionId: "rangpur-div" },
    { id: "panchagarh-dist", name: "Panchagarh", divisionId: "rangpur-div" },
    { id: "rangpur-dist", name: "Rangpur", divisionId: "rangpur-div" },
    { id: "thakurgaon-dist", name: "Thakurgaon", divisionId: "rangpur-div" },

    // Mymensingh Division
    { id: "jamalpur-dist", name: "Jamalpur", divisionId: "mymensingh-div" },
    { id: "mymensingh-dist", name: "Mymensingh", divisionId: "mymensingh-div" },
    { id: "netrokona-dist", name: "Netrokona", divisionId: "mymensingh-div" },
    { id: "sherpur-dist", name: "Sherpur", divisionId: "mymensingh-div" },
  ];

  for (const dist of districts) {
    await prisma.district.upsert({
      where: { id: dist.id },
      update: {},
      create: dist,
    });
  }

  // -----------------------------
  // Sample Upazilas
  // -----------------------------
  const upazilas = [
    { id: "dhanmondi-upa", name: "Dhanmondi", districtId: "dhaka-dist" },
    { id: "uttara-upa", name: "Uttara", districtId: "dhaka-dist" },
    { id: "mirpur-upa", name: "Mirpur", districtId: "dhaka-dist" },
    { id: "gulshan-upa", name: "Gulshan", districtId: "dhaka-dist" },
    { id: "pahartali-upa", name: "Pahartali", districtId: "chattogram-dist" },
    { id: "boalkhali-upa", name: "Boalkhali", districtId: "chattogram-dist" },
    { id: "beanibazar-upa", name: "Beanibazar", districtId: "sylhet-dist" },
    { id: "golapganj-upa", name: "Golapganj", districtId: "sylhet-dist" },
  ];

  for (const upz of upazilas) {
    await prisma.upazila.upsert({
      where: { id: upz.id },
      update: {},
      create: upz,
    });
  }

  // -----------------------------
  // Sample Unions
  // -----------------------------
  const unions = [
    { id: "uttara-union-1", name: "Ward 1", upazilaId: "uttara-upa" },
    { id: "uttara-union-2", name: "Ward 2", upazilaId: "uttara-upa" },
    { id: "mirpur-union-1", name: "Ward 1", upazilaId: "mirpur-upa" },
    { id: "pahartali-union-1", name: "Ward 1", upazilaId: "pahartali-upa" },
  ];

  for (const u of unions) {
    await prisma.union.upsert({
      where: { id: u.id },
      update: {},
      create: u,
    });
  }

  // -----------------------------
  // Sample Polling Units
  // -----------------------------
  const pollingUnits = [
    {
      id: "uttara-ps-1",
      name: "Uttara School & College",
      unionId: "uttara-union-1",
    },
    {
      id: "uttara-ps-2",
      name: "Uttara High School",
      unionId: "uttara-union-2",
    },
    {
      id: "mirpur-ps-1",
      name: "Mirpur Govt. High School",
      unionId: "mirpur-union-1",
    },
    {
      id: "pahartali-ps-1",
      name: "Pahartali High School",
      unionId: "pahartali-union-1",
    },
  ];

  for (const ps of pollingUnits) {
    await prisma.polling_unit.upsert({
      where: { id: ps.id },
      update: {},
      create: ps,
    });
  }

  console.log("✅ Geographical data seeded");

  // -----------------------------
  // Organization
  // -----------------------------
  const organization = await prisma.organization.upsert({
    where: { slug: "bangladesh-democratic-party" },
    update: {},
    create: {
      name: "Bangladesh Democratic Party",
      slug: "bangladesh-democratic-party",
      domain: "bdp.org.bd",
      logo: null,
      metadata: {
        foundedYear: 2024,
        ideology: "Democratic",
        description: "A democratic political organization for Bangladesh",
      },
    },
  });

  console.log("✅ Organization created:", organization.name);

  // -----------------------------
  // Roles (without organization relation)
  // -----------------------------
  const superAdminRole = await prisma.role.upsert({
    where: { id: "super-admin-role" },
    update: {},
    create: {
      id: "super-admin-role",
      name: "Super Admin",
      description: "Full system access",
      isSystem: true,
      isSuperAdmin: true,
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { id: "member-role" },
    update: {},
    create: {
      id: "member-role",
      name: "Member",
      description: "Regular party member",
      isSystem: true,
      isSuperAdmin: false,
    },
  });

  console.log("✅ Roles created");

  // -----------------------------
  // Sample Users with Areas
  // -----------------------------
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { nid: "1234567890" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      nid: "1234567890",
      password: hashedPassword,
      status: "ACTIVE",
      gender: "MALE",
      email: {
        create: {
          email: "admin@bdp.org.bd",
          isVerified: true,
        },
      },
      phoneNumber: {
        create: {
          phoneNumber: "+8801711111111",
          isVerified: true,
        },
      },
      area: {
        create: {
          divisionId: "dhaka-div",
          districtId: "dhaka-dist",
          upazilaId: "uttara-upa",
          unionId: "uttara-union-1",
          pollingUnitId: "uttara-ps-1",
        },
      },
    },
  });

  // Create admin membership
  await prisma.member.upsert({
    where: {
      userId: adminUser.id,
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: adminUser.id,
      roleId: superAdminRole.id,
      isAdmin: true,
    },
  });

  console.log("✅ Admin user created");

  // Regular Members
  const members = [
    {
      firstName: "Kamal",
      lastName: "Hossain",
      nid: "2234567890",
      email: "kamal@example.com",
      phone: "+8801722222222",
      gender: "MALE" as const,
      divisionId: "dhaka-div",
      districtId: "dhaka-dist",
      upazilaId: "uttara-upa",
      unionId: "uttara-union-1",
      pollingUnitId: "uttara-ps-1",
    },
    {
      firstName: "Fatema",
      lastName: "Begum",
      nid: "3234567890",
      email: "fatema@example.com",
      phone: "+8801733333333",
      gender: "FEMALE" as const,
      divisionId: "dhaka-div",
      districtId: "dhaka-dist",
      upazilaId: "uttara-upa",
      unionId: "uttara-union-2",
      pollingUnitId: "uttara-ps-2",
    },
    {
      firstName: "Rahman",
      lastName: "Ahmed",
      nid: "4234567890",
      email: "rahman@example.com",
      phone: "+8801744444444",
      gender: "MALE" as const,
      divisionId: "dhaka-div",
      districtId: "dhaka-dist",
      upazilaId: "mirpur-upa",
      unionId: "mirpur-union-1",
      pollingUnitId: "mirpur-ps-1",
    },
    {
      firstName: "Sultana",
      lastName: "Khatun",
      nid: "5234567890",
      email: "sultana@example.com",
      phone: "+8801755555555",
      gender: "FEMALE" as const,
      divisionId: "chattogram-div",
      districtId: "chattogram-dist",
      upazilaId: "pahartali-upa",
      unionId: "pahartali-union-1",
      pollingUnitId: "pahartali-ps-1",
    },
    {
      firstName: "Rahim",
      lastName: "Khan",
      nid: "6234567890",
      email: "rahim@example.com",
      phone: "+8801766666666",
      gender: "MALE" as const,
      divisionId: "dhaka-div",
      districtId: "dhaka-dist",
      upazilaId: "gulshan-upa",
      unionId: "uttara-union-1",
      pollingUnitId: "uttara-ps-1",
    },
  ];

  for (const memberData of members) {
    const user = await prisma.user.upsert({
      where: { nid: memberData.nid },
      update: {},
      create: {
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        nid: memberData.nid,
        password: hashedPassword,
        status: "ACTIVE",
        gender: memberData.gender,
        email: {
          create: {
            email: memberData.email,
            isVerified: true,
          },
        },
        phoneNumber: {
          create: {
            phoneNumber: memberData.phone,
            isVerified: true,
          },
        },
        area: {
          create: {
            divisionId: memberData.divisionId,
            districtId: memberData.districtId,
            upazilaId: memberData.upazilaId,
            unionId: memberData.unionId,
            pollingUnitId: memberData.pollingUnitId,
          },
        },
      },
    });

    await prisma.member.upsert({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: user.id,
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        userId: user.id,
        roleId: memberRole.id,
        isAdmin: false,
      },
    });
  }

  console.log("✅ Sample members created");

  // -----------------------------
  // Elections
  // -----------------------------
  const now = new Date();
  const appealStart = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
  const appealEnd = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
  const voteStart = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000); // 6 days from now
  const voteEnd = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000); // 12 days from now

  const election = await prisma.election.create({
    data: {
      title: "General Committee Election 2025",
      description:
        "Annual election for central committee positions. All active members are eligible to apply and vote.",
      organizationId: organization.id,
      appealStartDate: appealStart,
      appealEndDate: appealEnd,
      voteStartDate: voteStart,
      voteEndDate: voteEnd,
      status: "APPEAL_PERIOD",
      positions: {
        create: [
          {
            name: "President",
            description:
              "Lead the organization, represent members nationally and internationally, preside over meetings",
            maxCandidates: 5,
            displayOrder: 1,
          },
          {
            name: "General Secretary",
            description:
              "Manage day-to-day administrative affairs, coordinate between committees, maintain records",
            maxCandidates: 5,
            displayOrder: 2,
          },
          {
            name: "Treasurer",
            description:
              "Oversee financial matters, maintain accounts, prepare financial reports",
            maxCandidates: 3,
            displayOrder: 3,
          },
          {
            name: "Organizing Secretary",
            description:
              "Coordinate organizational activities, member recruitment, grassroots mobilization",
            maxCandidates: 3,
            displayOrder: 4,
          },
          {
            name: "Publicity Secretary",
            description:
              "Manage public relations, media communications, and party publications",
            maxCandidates: 3,
            displayOrder: 5,
          },
        ],
      },
    },
    include: {
      positions: true,
    },
  });

  console.log("✅ Election created:", election.title);

  // Create sample candidate applications
  const positions = await prisma.electionPosition.findMany({
    where: { electionId: election.id },
  });

  const allUsers = await prisma.user.findMany({
    where: {
      status: "ACTIVE",
      membership: {
        organizationId: organization.id,
      },
    },
    take: 5,
  });

  if (allUsers.length >= 3) {
    // President candidates
    await prisma.candidate.create({
      data: {
        positionId: positions[0].id,
        userId: allUsers[0].id,
        statement:
          "I am committed to strengthening our democratic values and expanding our grassroots network across all divisions of Bangladesh. Together we can build a stronger, more inclusive organization.",
        status: "APPROVED",
      },
    });

    await prisma.candidate.create({
      data: {
        positionId: positions[0].id,
        userId: allUsers[1].id,
        statement:
          "With 10 years of experience in political organizing, I will focus on youth engagement, digital transformation, and transparent governance to take our party to new heights.",
        status: "PENDING",
      },
    });

    // General Secretary candidates
    await prisma.candidate.create({
      data: {
        positionId: positions[1].id,
        userId: allUsers[2].id,
        statement:
          "My vision is to modernize our administrative systems, improve member communication, and ensure efficient coordination between all party committees.",
        status: "APPROVED",
      },
    });

    // Treasurer candidate
    if (allUsers.length >= 4) {
      await prisma.candidate.create({
        data: {
          positionId: positions[2].id,
          userId: allUsers[3].id,
          statement:
            "As a chartered accountant with NGO experience, I will ensure complete financial transparency, implement robust accounting systems, and maximize resource utilization.",
          status: "PENDING",
        },
      });
    }

    console.log("✅ Sample candidates created");
  }

  // Create a completed past election for reference
  const pastElection = await prisma.election.create({
    data: {
      title: "Committee Election 2024",
      description: "Previous year's central committee election - Completed",
      organizationId: organization.id,
      appealStartDate: new Date("2024-01-01"),
      appealEndDate: new Date("2024-01-15"),
      voteStartDate: new Date("2024-01-20"),
      voteEndDate: new Date("2024-01-25"),
      status: "COMPLETED",
      isCounted: true,
      countedAt: new Date("2024-01-26"),
      positions: {
        create: [
          {
            name: "President",
            description: "Party President",
            displayOrder: 1,
          },
          {
            name: "General Secretary",
            description: "General Secretary",
            displayOrder: 2,
          },
        ],
      },
    },
    include: {
      positions: true,
    },
  });

  // Add some candidates with votes to the past election
  if (allUsers.length >= 2) {
    const pastPositions = await prisma.electionPosition.findMany({
      where: { electionId: pastElection.id },
    });

    await prisma.candidate.create({
      data: {
        positionId: pastPositions[0].id,
        userId: allUsers[0].id,
        statement: "Previous election candidate",
        status: "APPROVED",
        voteCount: 45,
      },
    });

    await prisma.candidate.create({
      data: {
        positionId: pastPositions[0].id,
        userId: allUsers[1].id,
        statement: "Previous election candidate",
        status: "APPROVED",
        voteCount: 32,
      },
    });

    console.log("✅ Past election created with results");
  }

  console.log("\n🎉 All seed data completed successfully!");
  console.log("\n📝 Sample Credentials:");
  console.log("   Admin: admin@bdp.org.bd / password123");
  console.log("   Member: kamal@example.com / password123");
  console.log("\n📊 Created:");
  console.log("   - 8 Divisions");
  console.log("   - 64 Districts");
  console.log("   - 8 Upazilas");
  console.log("   - 4 Unions");
  console.log("   - 4 Polling Units");
  console.log("   - 1 Organization");
  console.log("   - 2 Roles");
  console.log("   - 6 Users");
  console.log("   - 2 Elections (1 active, 1 completed)");
  console.log("   - 5 Positions");
  console.log("   - 6 Candidates");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
