export type SpecTab = "Specifications" | "Harvest Details" | "Quality Certificates";

export interface ProductSpec {
  label: string;
  value: string;
  verified?: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface ChartBar {
  label: string;
  heightPct: number; // 0–100
  highlighted?: boolean;
  tooltip?: string;
}

export interface Certification {
  id: string;
  label: string;
  badgeClass: string; // full Tailwind class string for inline badge
}

export interface FarmerProfile {
  name: string;
  location: string;
  rating: number;
  salesCount: number;
  responseTime: string;
  onTimeDelivery: string;
  avatarUrl: string;
  certifications: Certification[];
}

export interface LogisticsDetail {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface ProductDetail {
  id: string;
  listingId: string;
  name: string;
  gradeLabel: string;
  pricePerTon: number;
  priceDrop?: string;
  availableTons: number;
  totalTons: number; // for the progress bar
  minOrderTons: number;
  defaultQuantity: number;
  estimatedShipping: number;
  defaultDeliveryCity: string;
  specs: ProductSpec[];
  description: string;
  galleryImages: GalleryImage[];
  chartBars: ChartBar[];
  benchmarkLabel: string;
  farmer: FarmerProfile;
  mapImageUrl: string;
  logistics: LogisticsDetail[];
}



export const maizeProductDetail: ProductDetail = {
  id: "mz-8821",
  listingId: "#MZ-8821",
  name: "Premium Yellow Maize",
  gradeLabel: "Grade A Verified",
  pricePerTon: 240.0,
  priceDrop: "Price dropped 2% yesterday",
  availableTons: 150,
  totalTons: 330,
  minOrderTons: 5,
  defaultQuantity: 10,
  estimatedShipping: 45.0,
  defaultDeliveryCity: "Nairobi",
  galleryImages: [
    {
      id: "1",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNLH7p9K_8MdxjKJyrO9Mjax6I_4OeRkJLVGZnRya3hOtK23ZsdMyb09ZGsVye-UDSgIs_mc_8mjb-mWMhQbhMqIBYaHa9HdMIfJTswZzSfxldzsILrQAvK1iFZcOuVviVt_EnjGYI9p0dwIZFFDTNycEsiiaymtJnjphdJ45xZzkGC3h2dUYcdpA4HMC4iYo8xRhG_ngL2zcjHTJ4V0Fhyb_Ph-XHsiRTTnz1MBYU23_0XaVNwP2amgudJfx01heolokKIyzLiIMr",
      alt: "Close up of dried yellow corn kernels in bulk",
    },
    {
      id: "2",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ12msmP8CsGIuJ3fTFU8iiq8Bdr1UwHskZr-gSujNz7Q58c-nMKwKOrCAR3HuLILp2G6RxNHVpucyV09HVYOr7qBtaVJJp4JkxLkDUIyAY7niHOEpuSA8TcLKeAhcGqRHMMw2T9gEaAXrTZuzbLpl8aaunCXWodwAkNC6lgztU31ir9WP7BMNf3I2NQsR-BmL9cbGNqJqMM2HeWouGNWsi3A6vAANxCvXeADAYgkH4H62lK4A_DzAy1SlKc3Qke6358FiOBWzxWiP",
      alt: "Close up of corn kernels",
    },
    {
      id: "3",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMo3a2YAzfuuVcoGUW1cn5FtM61B_QJ3GnbqAtlYf7Lg2zzGWRq2gXRG8Opx4-0GBdBK1nfpio2HvDoAv6sb9HEvwKnHAZyRyv4lpWKisrDJdUqb0N7KBL6HHVMLI-C-mwWqDmFV7b7GmvJ9iFeD6Sc4SMLNyNMXhmA_ipxlClt7xdmW59WshqjrY6QBhjyqt76OvGgP2lhLc6cxp3LZz-XE1DrVIiYq6qbqoYQRa6Qe3E4whsHb5yoXUlS6PMEbxZU386TJ3EdxYO",
      alt: "Corn cobs in a woven basket",
    },
    {
      id: "4",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtiUqzuCs4mUEYoEURRQicMoDE-rbSpaV-7ugUXWr1hZGauAi2ipDf2tnovy7tGAouV4TAKN-xq_crek5drXvilWi4KxSphYfWPBeyeeNl0g-koK8tPjO24umQrxWX1TYO5dSkMhdORY18k8BLv_X-VwmxnDeF4ostVt6TyyhDBhaFCJPDqwi4aEl6RengSdrtGGq6Ww3BNqSOZe9ogGVJfrq0SKLTskyACmN5RVgmlh8v8vv8bO78j8M9BXLWb3K0OSEA0RuYI1ZB",
      alt: "Field of corn crops during sunset",
    },
    {
      id: "5",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiMVtm0UnkLPP-wfJVl_4aAINA_c5fV1tKPvGK7Y9UYpVPWA9C94fQgLwSSNKO5AMLdKmfh-HCgVTF1IGr8aja7IjB-2SiqoqGxG71OYPYGm3dmH0YyA217htS70cJj-ltwpH2en4kN9xa5IkguX2ixI5xfR_luyDNKd02qV6fYf8PMy9zhFXnNz7AQVXnB3mEek7bmB60jRm7qFCNes1TK62Ht3Xisf8NdW2v17_kXrTtOj6gyER7_xDMpmTIg2dWWxQHjAEItd6X",
      alt: "Farmer inspecting corn quality",
    },
  ],
  specs: [
    { label: "Variety", value: "Hybrid H614 (High Yield)" },
    { label: "Moisture Content", value: "12.8% (Dry)", verified: true },
    { label: "Foreign Matter", value: "< 1.0%" },
    { label: "Broken Grains", value: "< 2.5%" },
    { label: "Harvest Date", value: "Oct 15, 2023" },
    { label: "Packaging", value: "90kg Sisal Bags" },
  ],
  description:
    "This premium batch of Hybrid H614 Maize was cultivated in the fertile highlands of the Rift Valley. Harvested under optimal dry conditions, the grain features consistent kernel size and excellent color. Stored in hermetic silos immediately after drying to ensure zero pest infestation. Ideal for milling into Grade 1 Maize Flour.",
  chartBars: [
    { label: "Week 1", heightPct: 60, tooltip: "Week 1" },
    { label: "Week 2", heightPct: 65 },
    { label: "Week 3", heightPct: 55 },
    { label: "Week 4", heightPct: 70 },
    { label: "Week 5", heightPct: 75 },
    { label: "Today", heightPct: 65, highlighted: true, tooltip: "$240" },
  ],
  benchmarkLabel: "5% Below Market Rate",
  farmer: {
    name: "Green Valley Co-op",
    location: "Nakuru, Rift Valley",
    rating: 4.8,
    salesCount: 124,
    responseTime: "~2 hrs",
    onTimeDelivery: "98%",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhlePQHofZ_OfrS8FwwADvd8930GxnjkoBwoIsmAJBPfXnTr-vg7rAKJX_2lx97Z9uieBH-h4vYQ5qwjZA2MNyX85BlJLLjhQmhvjue_xxOzxAMmLP3yfScFkRiB58K3adyBqTV4XR3MQDkLFhJeYhpK5frf9s3WEuAiHoMVnxXSuqRQHvCROB3C6V1xhHTMzHp4moKMQ5YG2jKLflFLSREC3PRW5DCSOdrrVykxe_xXGe-bWPYvKg3k8eJuyrwbRpag_fQQhH9oHs",
    certifications: [
      {
        id: "organic",
        label: "Organic",
        badgeClass:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
      },
      {
        id: "gap",
        label: "GAP Certified",
        badgeClass:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800",
      },
      {
        id: "fairtrade",
        label: "Fair Trade",
        badgeClass:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
      },
    ],
  },
  mapImageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDbCjWf60neTs_PGGQRysEaSmCHqSDeucXsxAJ-co7pvycSQ6q6amgKAkdUkzFOGkYp-xGCB1Ig-V7icuzxb6t6VfYJgIBmckx5IEDfBBC4RanYmqoFeSJrEdMwfzONlE_v7688Fa1go3sd8hPd_0n1YuoaHUowRwlH44l8BDhltm50SFByRPMLoV7JPGMRGBE7AotOJBlsR3XCnwikm1K7VjNZdVGV3hLSYUEMVXqYp6xnh4XVv4DFTEoUGafb1YXVsZO6GdKNVoFD",
  logistics: [
    {
      icon: "inventory_2",
      iconBg: "bg-blue-50 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      title: "Packaging",
      description: "Product is packed in 90kg standard sisal bags, stacked on pallets.",
    },
    {
      icon: "local_shipping",
      iconBg: "bg-orange-50 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      title: "Transport Options",
      description:
        "Available for pickup by Buyer's Truck or Third-party Logistics via Ministry platform.",
    },
    {
      icon: "schedule",
      iconBg: "bg-green-50 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      title: "Lead Time",
      description: "Ready for dispatch within 24 hours of payment confirmation.",
    },
  ],
};