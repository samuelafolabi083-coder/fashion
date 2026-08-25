/**
 * TM FASHION HOUSE & BESPOKE COUTURE ATELIER
 * Curated Catalog & Designer Profile
 */

const INITIAL_DESIGNER_PROFILE = {
    name: "T.M. (Lead Couturier & Creative Director)",
    title: "Founder, Master Tailor & Creative Director",
    brand: "TM Fashion House",
    established: 2020,
    atelierLocation: "Lagos & Abuja, Nigeria • International Dispatch",
    bio: "As the founder and master designer behind TM Fashion House, our creative director brings over a decade of mastery in bespoke tailoring, high-precision African sartorial kaftans, sharp executive suits, and bespoke women's couture gowns. Every ready-to-wear piece is hand-finished with signature embroidery, premium cashmere wools, and rich silks.",
    philosophy: "Fashion is the supreme expression of identity and royalty. We blend authentic African heritage with sharp modern luxury silhouettes.",
    quote: "Every stitch is a statement of elegance, confidence, and bespoke craftsmanship.",
    image: "./img/c43660ab-0248-4a86-8bbc-b82530665571.png",
    signatureUrl: "TM Fashion House",
    accolades: [
        { year: "2025", title: "African Haute Couture & Sartorial Excellence Award" },
        { year: "2024", title: "Top Bespoke Menswear & Womenswear Designer of the Year" },
        { year: "2023", title: "Lagos Fashion Week Featured Ready-to-Wear Showcase" }
    ],
    stats: {
        customCreations: "1,200+",
        readyToWearPieces: "500+",
        countriesShipped: 25,
        ratingScore: "4.9 / 5.0"
    }
};

const INITIAL_PRODUCTS = [
    {
        id: "TM-001",
        name: "Brown Luxury Hand-Embroidered Kaftan",
        category: "men",
        gender: "men",
        price: 85000,
        currencySymbol: "₦",
        originalPrice: 95000,
        badge: "Bestseller",
        inStock: true,
        stockCount: 5,
        readyToShip: true,
        description: "Mastercrafted from superfine polished cotton-wool blend with intricate chest embroidery and structured neck collar. Finished with custom tonal cufflinks.",
        fabric: "100% Superfine Polished Cotton-Wool Blend",
        care: "Dry Clean or Gentle Hand Wash & Steam Press",
        designerNote: "A signature TM design tailored for executive boardrooms, weddings, and prestigious galas.",
        sizes: ["M", "L", "XL", "XXL", "Custom"],
        colors: [
            { name: "Rich Earth Brown", hex: "#6D4C41", code: "brown" },
            { name: "Midnight Black", hex: "#111111", code: "black" }
        ],
        images: [
            "./img/1000465980.png",
            "./img/1000472799.jpg"
        ],
        rating: 5.0,
        reviewsCount: 38,
        isFeatured: true
    },
    {
        id: "TM-002",
        name: "Peach Classic Bespoke Senator Kaftan",
        category: "men",
        gender: "men",
        price: 78000,
        currencySymbol: "₦",
        originalPrice: 88000,
        badge: "New Arrival",
        inStock: true,
        stockCount: 4,
        readyToShip: true,
        description: "Subtle peach luxury drape tailored with precision seams, clean concealed placket, and hand-finished trouser cuffs.",
        fabric: "Premium Italian Cashmere-Cotton Blend",
        care: "Dry Clean Only",
        designerNote: "Warm, understated royalty that commands attention at any ceremonial celebration.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [
            { name: "Peach Blossom", hex: "#FFDAB9", code: "peach" },
            { name: "Ivory Cream", hex: "#FDF5E6", code: "cream" }
        ],
        images: [
            "./img/1000465979.png",
            "./img/1000472807.jpg"
        ],
        rating: 4.9,
        reviewsCount: 22,
        isFeatured: true
    },
    {
        id: "TM-003",
        name: "White Premium Royal Agbada & Kaftan Set",
        category: "men",
        gender: "men",
        price: 120000,
        currencySymbol: "₦",
        originalPrice: 140000,
        badge: "Royal Collection",
        inStock: true,
        stockCount: 3,
        readyToShip: true,
        description: "Pristine white 3-piece grand attire featuring heavy geometric thread embroidery, matching trousers, and hand-sculpted fila cap options.",
        fabric: "Pure Swiss Voile & Starch-Finished Damask",
        care: "Specialist Garment Valet Only",
        designerNote: "The ultimate traditional wedding and VIP ceremony statement wear.",
        sizes: ["M", "L", "XL", "XXL", "Custom Bespoke"],
        colors: [
            { name: "Pristine Snow White", hex: "#FFFFFF", code: "white" }
        ],
        images: [
            "./img/1000465978.png"
        ],
        rating: 5.0,
        reviewsCount: 45,
        isFeatured: true
    },
    {
        id: "TM-004",
        name: "Black Gold Aristocrat Senator Suit",
        category: "men",
        gender: "men",
        price: 90000,
        currencySymbol: "₦",
        originalPrice: 105000,
        badge: "Executive VIP",
        inStock: true,
        stockCount: 6,
        readyToShip: true,
        description: "Deep obsidian black fabric accented with shimmering metallic gold architectural embroidery across the front chest panel.",
        fabric: "100% Super 140s Wool Blend",
        care: "Dry Clean Recommended",
        designerNote: "Clean, authoritative, and impeccably sharp. Drapes effortlessly on all postures.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [
            { name: "Obsidian & Gold", hex: "#111111", code: "black" }
        ],
        images: [
            "./img/1000470316.jpg"
        ],
        rating: 4.9,
        reviewsCount: 19,
        isFeatured: true
    },
    {
        id: "TM-005",
        name: "Navy Blue Sartorial Executive Two-Piece",
        category: "men",
        gender: "men",
        price: 82000,
        currencySymbol: "₦",
        originalPrice: 90000,
        badge: "Daily Luxury",
        inStock: true,
        stockCount: 8,
        readyToShip: true,
        description: "Tailored navy blue two-piece senator outfit with modern minimalist detailing and custom comfort waistband.",
        fabric: "Heavyweight Wrinkle-Resistant Tropical Wool",
        care: "Hand Wash Cold or Dry Clean",
        designerNote: "Versatile everyday elegance designed for high-profile business meetings and evening dinners.",
        sizes: ["M", "L", "XL", "XXL"],
        colors: [
            { name: "Royal Navy Blue", hex: "#1B2A47", code: "navy" }
        ],
        images: [
            "./img/1000470318.jpg",
            "./img/1000472802.jpg"
        ],
        rating: 4.8,
        reviewsCount: 26,
        isFeatured: false
    },
    {
        id: "TM-006",
        name: "Carton Sand Architectural Kaftan",
        category: "men",
        gender: "men",
        price: 75000,
        currencySymbol: "₦",
        originalPrice: 85000,
        badge: "Ready to Ship",
        inStock: true,
        stockCount: 4,
        readyToShip: true,
        description: "Earthy camel tone featuring asymmetrical accent buttons and contemporary side-slit drape.",
        fabric: "Italian Cotton Twill & Linen",
        care: "Gentle Machine Wash or Dry Clean",
        designerNote: "A relaxed luxury piece inspired by modern Sahara color palettes.",
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { name: "Desert Sand", hex: "#C2A379", code: "sand" }
        ],
        images: [
            "./img/1000472797.jpg"
        ],
        rating: 4.85,
        reviewsCount: 15,
        isFeatured: false
    },
    {
        id: "TM-007",
        name: "Regal Velvet & Silk Festive Reception Gown",
        category: "women",
        gender: "women",
        price: 110000,
        currencySymbol: "₦",
        originalPrice: 130000,
        badge: "Couture Favorite",
        inStock: true,
        stockCount: 3,
        readyToShip: true,
        description: "Sculpted bodice with intricate hand-beaded lace accents, sweeping flared silhouette, and supportive interior corset structure.",
        fabric: "Silk Velvet, French Beaded Lace & Satin Lining",
        care: "Specialist Clean Only",
        designerNote: "Designed to turn heads on every red carpet, gala, and wedding reception dance floor.",
        sizes: ["XS", "S", "M", "L", "XL", "Custom"],
        colors: [
            { name: "Royal Burgundy", hex: "#6B1D2F", code: "burgundy" },
            { name: "Emerald Glaze", hex: "#1A4D3E", code: "emerald" }
        ],
        images: [
            "./img/1000491617.png",
            "./img/1000491618.png"
        ],
        rating: 5.0,
        reviewsCount: 31,
        isFeatured: true
    },
    {
        id: "TM-008",
        name: "Haute Couture Peplum & Silhouette Set",
        category: "women",
        gender: "women",
        price: 95000,
        currencySymbol: "₦",
        originalPrice: 110000,
        badge: "Runway Piece",
        inStock: true,
        stockCount: 4,
        readyToShip: true,
        description: "Architectural peplum jacket with exaggerated hourglass cinching paired with high-waisted tailored pencil skirt.",
        fabric: "Heavy Silk Mikado & Structured Jacquard",
        care: "Dry Clean Only",
        designerNote: "Power dressing reimagined with fierce feminine elegance.",
        sizes: ["XS", "S", "M", "L"],
        colors: [
            { name: "Midnight Black", hex: "#111111", code: "black" },
            { name: "Sunset Crimson", hex: "#8B1E1E", code: "red" }
        ],
        images: [
            "./img/1000491599.png",
            "./img/1000479772.jpg"
        ],
        rating: 4.95,
        reviewsCount: 18,
        isFeatured: true
    },
    {
        id: "TM-009",
        name: "Contemporary Chic African Print Couture",
        category: "women",
        gender: "women",
        price: 70000,
        currencySymbol: "₦",
        originalPrice: 80000,
        badge: "Bestseller",
        inStock: true,
        stockCount: 7,
        readyToShip: true,
        description: "Premium authentic Dutch wax print crafted into a modern midi cut with balloon sleeves and waist-cinching belt.",
        fabric: "100% Premium Cotton Wax Print with Silk Trims",
        care: "Hand Wash Cold",
        designerNote: "Rich cultural heritage transformed into a head-turning everyday statement.",
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { name: "Vibrant Jewel Tones", hex: "#D97724", code: "print" }
        ],
        images: [
            "./img/1000479768.jpg",
            "./img/1000479760.jpg"
        ],
        rating: 4.8,
        reviewsCount: 29,
        isFeatured: false
    },
    {
        id: "TM-010",
        name: "Emerald Siren Evening Drape Dress",
        category: "women",
        gender: "women",
        price: 88000,
        currencySymbol: "₦",
        originalPrice: 100000,
        badge: "Limited Edition",
        inStock: true,
        stockCount: 2,
        readyToShip: true,
        description: "Liquid emerald green satin with dramatic side split, pleated waist crossover, and graceful open-back neckline.",
        fabric: "100% Heavy Silk Satin",
        care: "Specialist Dry Clean",
        designerNote: "Sculpted for gala dinners, black-tie awards, and unforgettable milestones.",
        sizes: ["XS", "S", "M", "L"],
        colors: [
            { name: "Deep Emerald", hex: "#0E3A2F", code: "emerald" }
        ],
        images: [
            "./img/1000479762.jpg",
            "./img/1000479774.jpg"
        ],
        rating: 5.0,
        reviewsCount: 14,
        isFeatured: true
    }
];

const LOOKBOOK_ITEMS = [
    {
        season: "Royal Sartorial Collection 2026",
        title: "The Sovereign African Aristocrat",
        location: "TM Fashion Atelier, Lagos",
        description: "A tribute to bold African power dressing—hand-embroidered agbadas and architectural senator suits.",
        image: "./img/1000465978.png",
        featuredProductIds: ["TM-001", "TM-003", "TM-004"]
    },
    {
        season: "Haute Couture Women 2026",
        title: "Elegance in Motion & Velvet",
        location: "Eko Atlantic Gala Showcase",
        description: "Fluid satin gowns, beaded French lace, and structural corset peplums designed for memorable occasions.",
        image: "./img/1000491617.png",
        featuredProductIds: ["TM-007", "TM-008", "TM-010"]
    },
    {
        season: "Bespoke Ceremony Capsule",
        title: "The Masterpiece Wedding Series",
        location: "TM Private Atelier Suite",
        description: "Custom groom wedding sets, groomsmen packages, and one-of-a-kind bride reception masterpieces.",
        image: "./img/1000470316.jpg",
        featuredProductIds: ["TM-002", "TM-005"]
    }
];

const BESPOKE_SERVICES = [
    {
        id: "bespoke-men-sartorial",
        title: "Bespoke Men's Kaftan & Agbada Tailoring",
        tagline: "Custom-fitted royal senator suits & luxury agbadas",
        duration: "1 - 2 Weeks",
        fittings: "2 Fittings + Hand Finishing",
        startingPrice: 65000,
        currencySymbol: "₦",
        description: "Choose your exact fabric (Swiss Voile, Cashmere, Italian Wool) and custom embroidery motifs. Cut to your exact shoulder and chest measurements.",
        image: "./img/1000465980.png"
    },
    {
        id: "bespoke-women-couture",
        title: "Custom Women's Gowns & Reception Wears",
        tagline: "One-of-a-kind gala, wedding guest, & bridal dresses",
        duration: "2 - 3 Weeks",
        fittings: "2 - 3 Private Fittings",
        startingPrice: 80000,
        currencySymbol: "₦",
        description: "From custom body-sculpting corsetry to hand-placed beadwork and custom train lengths tailored for your big day.",
        image: "./img/1000491617.png"
    },
    {
        id: "bespoke-wedding-group",
        title: "Wedding Entourage & Aso-Ebi Packages",
        tagline: "Synchronized luxury tailoring for groomsmen & bridal trains",
        duration: "3 - 4 Weeks",
        fittings: "Group Measurement & Fitting Sessions",
        startingPrice: 250000,
        currencySymbol: "₦",
        description: "Complete styling and synchronized production for wedding parties, including custom embroidery seals and monogramming.",
        image: "./img/1000470316.jpg"
    }
];

const PRESS_TESTIMONIALS = [
    {
        quote: "TM Fashion House delivers the cleanest cuts and sharpest embroidery in modern menswear. The fit is nothing short of majestic.",
        source: "Style Africa Magazine",
        author: "Chief Adebayo Williams, Cultural Patron"
    },
    {
        quote: "Ordering ready-to-wear that feels like a bespoke five-figure fitting is TM's superpower. Delivery is swift and the fabrics are top-tier.",
        source: "Lagos Style Tribune",
        author: "Dr. Ifeoma Okafor"
    },
    {
        quote: "The creative director's eye for proportion and modern heritage wear is world-class. My bespoke wedding suit was the highlight of the day.",
        source: "Wedding Digest VIP",
        author: "Tunde & Zainab Balogun"
    }
];

const INITIAL_ORDERS = [
    {
        id: "TM-ORD-8821",
        customerName: "Barrister Segun Adeleke",
        customerEmail: "s.adeleke@legalchambers.ng",
        items: [
            { id: "TM-001", name: "Brown Luxury Hand-Embroidered Kaftan", size: "XL", color: "Rich Earth Brown", quantity: 1, price: 85000 }
        ],
        total: 85000,
        date: "2026-08-25",
        status: "Hand Finishing",
        deliveryType: "Express Doorstep Courier",
        shippingAddress: "Plot 12, Victoria Island, Lagos"
    },
    {
        id: "TM-ORD-8822",
        customerName: "Dr. Amina Bello",
        customerEmail: "amina.bello@abuja-health.gov.ng",
        items: [
            { id: "TM-007", name: "Regal Velvet & Silk Festive Reception Gown", size: "M", color: "Royal Burgundy", quantity: 1, price: 110000 }
        ],
        total: 110000,
        date: "2026-08-25",
        status: "Pattern Cutting",
        deliveryType: "Interstate Courier Dispatch",
        shippingAddress: "Maitama District, Abuja, FCT"
    }
];

const INITIAL_BESPOKE_REQUESTS = [
    {
        id: "TM-BSPK-501",
        clientName: "Engr. Femi Alabi",
        clientEmail: "femi.alabi@energycorp.ng",
        phone: "+234 803 123 4567",
        serviceType: "Bespoke Men's Kaftan & Agbada Tailoring",
        eventDate: "2026-09-18",
        budget: "₦150,000 - ₦250,000",
        consultationType: "In-Person Atelier Fitting (Lagos)",
        status: "Consultation Scheduled",
        notes: "3-piece grand White and Gold Agbada set with bespoke family crest embroidery for traditional chieftaincy celebration.",
        measurements: { chest: "44 in", waist: "36 in", sleeve: "34 in", height: "6'1\"" }
    },
    {
        id: "TM-BSPK-502",
        clientName: "Folashade Morgan",
        clientEmail: "shade.morgan@creativeagency.ng",
        phone: "+234 812 987 6543",
        serviceType: "Custom Women's Gowns & Reception Wears",
        eventDate: "2026-10-05",
        budget: "₦120,000 - ₦180,000",
        consultationType: "WhatsApp Video Fitting Consultation",
        status: "Pending Review",
        notes: "Emerald green corseted dress with detachable train and hand-stitched crystal accents for sister's wedding.",
        measurements: { bust: "36 in", waist: "28 in", hips: "42 in", height: "5'7\"" }
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        INITIAL_DESIGNER_PROFILE,
        INITIAL_PRODUCTS,
        LOOKBOOK_ITEMS,
        BESPOKE_SERVICES,
        PRESS_TESTIMONIALS,
        INITIAL_ORDERS,
        INITIAL_BESPOKE_REQUESTS
    };
}
