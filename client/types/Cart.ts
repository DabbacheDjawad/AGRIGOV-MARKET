export interface CartItem {
  id: string;
  name: string;
  description: string;
  supplierName: string;
  supplierIcon: "verified" | "storefront";
  location: string;
  imageUrl: string;
  imageAlt: string;
  quantity: number;
  unitLabel: string;
  pricePerUnit: number;
  priceLabel: string;
}


export const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Red Onions (Grade A)",
    description: "Harvest: Oct 2023 | Dry Cured",
    supplierName: "Green Valley Cooperative",
    supplierIcon: "verified",
    location: "Kaduna North",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRX1VdVsHDaRcZkEZac-eIkOIay9Hr7u8lkWzsY1ozNnDYtcp7rbNQNZxpXbB-uGS8e2i9cr_uWRDRKcaCzoLI33uC5U3yphbuc-os3oeDBifcxFo5Hvr6U9UWEdVtPWnJs9N8A1xWYae-kkjE6BJW_byurrq2UBCUkfiWUT0w76i4H41VTf3oH-Upht5iixYDm4-E9aEzZMQcm5FYzdsdnw7plfPfhQBWE2MrqUlx7Q8h5AvXJmwPudFYkphr2ehBtLLotJ2rrUxn",
    imageAlt: "Sacks of red onions",
    quantity: 500,
    unitLabel: "kg",
    pricePerUnit: 450,
    priceLabel: "₦450 / kg",
  },
  {
    id: "2",
    name: "Tomatoes (Roma Variety)",
    description: "Partially Ripe | Long Shelf Life",
    supplierName: "Adewale Farms Ltd.",
    supplierIcon: "storefront",
    location: "Ogun State",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAraINWmh9-C--w-kQq0vqOsAddguYplP1TMvNN8JlrlDBQxotpFOm1LyKgwimlieaxO1k3-Ze5SolQ9YEsztrm3Qwj0u9xk18XPzNP_YLhxFD256vusl9k774_cGPXlMbCLPiB5tLmfN43XlpTemL6whP6hPGz4YZIIbGcemsDw1tBJKgDn1vG5YlruRWf-Fdw-wOt9ZsQKupu46lRkShifuKN_djZCQWoRxw3pSKje1o4DSUXOHtZ28ADllxUONQQjUicn1RcaCCB",
    imageAlt: "Fresh Roma tomatoes",
    quantity: 20,
    unitLabel: "Crates (25kg)",
    pricePerUnit: 8000,
    priceLabel: "₦8,000 / crate",
  },
  {
    id: "3",
    name: "Carrots (Large)",
    description: "Washed | Bagged",
    supplierName: "Jos Plateau Greens",
    supplierIcon: "verified",
    location: "Jos, Plateau",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFdQaK3GY2I6P0ImAQr_Z2NRmljUTwu9g_nTZWOmeV4MSTtiFRdJhaKCARpb49iswziN3wYzWyT7SbXQ57kKSiRMRjCdZjO67ZwmggMOW1o2cfRzSRYICrTULJdqC14-MxHylZyrdknhcyjJvK5D2qKhe6S1mXHRTPDWPaoz4ToLqQiQPKQOdrh2WGkjshUE_gTXJFO3m-b2hAkdbw2wiD1ycbzzlxGKMhkG4eaunrVmj1Z5NSRzL47EaGkwtSkTiDfRjmCTXOPRog",
    imageAlt: "Fresh orange carrots",
    quantity: 15,
    unitLabel: "Sacks (50kg)",
    pricePerUnit: 4500,
    priceLabel: "₦4,500 / sack",
  },
];