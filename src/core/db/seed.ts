import { PrismaClient } from "./client";

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
        { id: "brahmanbaria-dist", name: "Brahmanbaria", divisionId: "chattogram-div" },
        { id: "chandpur-dist", name: "Chandpur", divisionId: "chattogram-div" },
        { id: "feni-dist", name: "Feni", divisionId: "chattogram-div" },
        { id: "khagrachhari-dist", name: "Khagrachhari", divisionId: "chattogram-div" },
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
        { id: "uttara-ps-1", name: "Uttara School & College", unionId: "uttara-union-1" },
        { id: "uttara-ps-2", name: "Uttara High School", unionId: "uttara-union-2" },
        { id: "pahartali-ps-1", name: "Pahartali High School", unionId: "pahartali-union-1" },
    ];

    for (const ps of pollingUnits) {
        await prisma.polling_unit.upsert({
            where: { id: ps.id },
            update: {},
            create: ps,
        });
    }

    console.log("✅ Seed Completed Successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
