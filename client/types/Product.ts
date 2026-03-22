export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  description: string;
  grade: string;
  gradeColor: string;
  location: string;
  region: string;
  price: number;
  priceUnit: string;
  harvestOrder: number;
  postedAt: string;
  imageUrl: string;
  imageAlt: string;
  verified: boolean;
}

export interface Filters {
  categories: string[];
  region: string;
  grade: string | null;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Roma Tomatoes",
    category: "Vegetables",
    categoryId: "veg",
    description:
      "Freshly harvested firm Roma tomatoes, ideal for processing and retail. Box packaging.",
    grade: "Grade A",
    gradeColor: "bg-primary",
    location: "Central Valley Co-op",
    region: "Central Valley",
    price: 24.5,
    priceUnit: "20kg",
    harvestOrder: 5,
    postedAt: "2d ago",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCy6F06Zp_KyYkJ5eDAu6OB-7vCOnuulBKX3M1bldNnu2kcOrAFEa2dVpF32hZVxw1Bw9jraEC1JogO-XbmxoWt8Y3WBKx8YFEbyqY0zeAehPpBl-mh6lS8Z1JA_O2esv29z343BgFmxdVKlGnaFQL4hOo1sbOX07EvndRKDh5HC2HB7D-GgIVgRmih10bXlzQnXH4GchksSFWsF78KU3YFVmrA97hc6pyZ3p8gerJ_W-dNN7prf4zzzDiU68uYX395k9e82jygot3x",
    imageAlt: "Fresh red tomatoes in a wooden crate",
    verified: true,
  },
  {
    id: "2",
    name: "Yellow Maize (Corn)",
    category: "Grains",
    categoryId: "grains",
    description: "Dried yellow maize suitable for animal feed or milling. Bulk available.",
    grade: "Grade B",
    gradeColor: "bg-yellow-500",
    location: "North District Farmers",
    region: "North District",
    price: 180.0,
    priceUnit: "Ton",
    harvestOrder: 8,
    postedAt: "5h ago",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAsOgyjmPlVzOU3HT8hlEbBB7yC8aM0hu5wmovYJmxcPuGiQLPAVTMyLnHnV7u3kFHVxImcp_n1W1d-UF2wyw3N3PktZ5RFn8DCvB_FjNVx49pqURvisFq0wbGWsdvIFPw_9ptl6yQb_UaOXBd02_coGnYbEmOqWZAOv0zPKAXTpPitqoa4c3cnwpQ1q-TONDIbU8PKXdNeWoE_Val-NxKDQ1rAc19sCs1JskfpjveKZCiHO-RMLX4kqGDFNDlxmK92BpUIUAimeKSq",
    imageAlt: "Large pile of yellow maize corn",
    verified: true,
  },
  {
    id: "3",
    name: "Irish Potatoes",
    category: "Tubers",
    categoryId: "tubers",
    description: "Large size Irish potatoes, cleaned and bagged. Perfect for wholesale distribution.",
    grade: "Grade A",
    gradeColor: "bg-primary",
    location: "Highlands Aggregators",
    region: "Highlands",
    price: 32.0,
    priceUnit: "50kg",
    harvestOrder: 6,
    postedAt: "1d ago",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsfvt2qdv0YNeGu9aI2vQmxGIPxLdLtaFUVBWtQxPNRC_GDi3hKRcVHAwAU6oOZzgTr8JPkbfX3SHQK4li_5PnNDtEP57Ilk-Er6mxFVdF_yLZUXMnGXhCDaYBzcJ_fL8K2SdjPPdzO2J7dhNExy_0yl7sGT6bSCu5A5igu7RJwwiM7w3aKVlApHXY1irKs7o3NRJMbcg3YFir_TWjiaQvYZxm_DUpYDaHsoNjSzyIxthUmfOKU9FMQY0h5bUOiiOvUns1nawSURO",
    imageAlt: "Sacks of potatoes on the ground",
    verified: true,
  },
  {
    id: "4",
    name: "Green Cabbage",
    category: "Vegetables",
    categoryId: "veg",
    description: "Organic green cabbages, medium heads. Pesticide-free from Coastal Plains.",
    grade: "Organic",
    gradeColor: "bg-blue-500",
    location: "Coastal Organic Farms",
    region: "Coastal Plains",
    price: 150.0,
    priceUnit: "100pcs",
    harvestOrder: 10,
    postedAt: "Just now",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpT4Pp8dey2TqszdrQj9yL9zIgCE06OEH-f36N_UOKCgnYA-FQ0zG6Bvqhg4ewvmGWMQedg9vxpGgwcnNejQSQclb2dWVz7kxHdkOo7sDHNCTXQeiO_u7Yt9st1r6Wa09VwcQy35-HX2UBHAq-XKvy8HSy1crelL5vsbCz_VSY8Hs2YnK4t8ruZVc3AkKmN_W6p0UHkO_F1adihcKBcFhxuK-kR7H-za8l1UY6MBhwEx3PH52uqOsgPrRfxkKQKMG76zPkQ9gIsb40",
    imageAlt: "Fresh green cabbage heads",
    verified: true,
  },
  {
    id: "5",
    name: "Red Onions - Bombay",
    category: "Vegetables",
    categoryId: "veg",
    description: "High pungency red onions, Bombay variety. Cured and ready for long storage.",
    grade: "Grade A",
    gradeColor: "bg-primary",
    location: "Eastern Valley Group",
    region: "Central Valley",
    price: 12.0,
    priceUnit: "Net",
    harvestOrder: 4,
    postedAt: "3d ago",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGtODnQBtiPjsogrweXDSscNCObdYgEOQ2IrqwFKCL6MbZE2PfJl9qP_qmb31Sw2xgn4RXJYmK9w9qxf0vuc6ECO57zLWOdFswvpJx_QkG2YSo0f7k7cgnA9M-SVewKLyOSRpVs-WM9fIDhRFvLE80qIV-HvR95XHhERXbWi076sh1uxqwEZekVsuZiHYfonmBF6v_BH3NcnhwxVHZVhs_2FyyFHHU39JaChsg9ogVvpKLG1D1hAfKmPzuUyr9qt_fVtQpM1PBKVtm",
    imageAlt: "Fresh red onions",
    verified: true,
  },
  {
    id: "6",
    name: "Soya Beans",
    category: "Grains",
    categoryId: "grains",
    description: "Cleaned soya beans, high protein content. Suitable for oil extraction.",
    grade: "Export",
    gradeColor: "bg-indigo-500",
    location: "National Grain Reserve",
    region: "North District",
    price: 450.0,
    priceUnit: "Ton",
    harvestOrder: 2,
    postedAt: "1w ago",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbRBl1lf_peTaQGN-cOvaaaBI0MsdcbaYbhdZdTyje7PY4k2jFk-_Uu_LerTAmpqTUfaKPy7bM-PV34RI49E9u8C3fQWcFJdRAdSD343IvBcXDM-0SgS9q7-diZpbCCBpZe_SQMPWXtUiHMV0hdoGYD4GuajbB6hdDvGNT6yjneL00vQoQ-iQNM62-_FSiCuvnQiufyuhOdhhPil3Z8nPOBN6IcevynAYWxC-v1llh208fIImET28Sien6ncFolpCk0FE1i56H3Myb",
    imageAlt: "Heap of dry soya beans",
    verified: true,
  },
];