export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
export type GradeLabel = "Grade A" | "Grade B" | "Organic";
export type ViewMode = "grid" | "list";

export interface InventoryItem {
  id: string;
  name: string;
  harvestedDate: string;
  quantity: string;
  priceLabel: string; // e.g. "Price/kg"
  priceValue: string; // e.g. "$0.85"
  status: StockStatus;
  grade: GradeLabel;
  category: "Vegetables" | "Fruits" | "Grains";
  imageUrl: string;
  imageAlt: string;
}

export interface PendingOrder {
  id: string;
  buyerInitials: string;
  buyerName: string;
  itemDescription: string;
}

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}



export const inventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Russet Potatoes",
    harvestedDate: "Oct 12, 2023",
    quantity: "1,200 kg",
    priceLabel: "Price/kg",
    priceValue: "$0.85",
    status: "In Stock",
    grade: "Grade A",
    category: "Vegetables",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDuEAtOkTtO5Rcig3aOQy4wPi4iE8J3t71wi3zsEKmdefhD1pR-cm6eSNCZp8ZxkdOnEveaCRBgAH0BpoujxtDEfOBNTtkdwh0Kwh-gtdvaM41KMXJReW9GFr-GIZ_H98DLzcK2r_JVJZ9bhD6Pcd-WRF0ULmHEvmcjhDRB42XS0iFetJ6UX98iP4IxHhC8Z8T3IE2kAS7D2K651a6YzI7Xu7FR-a_n-SEEtZEXwtdwT9iUt8iH4qQ9CvQf4k30I5hDgDYhDwUuCk3o",
    imageAlt: "Pile of fresh russet potatoes with soil",
  },
  {
    id: "2",
    name: "Iceberg Lettuce",
    harvestedDate: "Oct 14, 2023",
    quantity: "150 heads",
    priceLabel: "Price/unit",
    priceValue: "$1.20",
    status: "Low Stock",
    grade: "Organic",
    category: "Vegetables",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsyrfRCHWXQpswYqu7Fwzx44L2XEuZXRaptkUYPB00akyiZxuhG_tz73y0KPoBaF6MS4hrHYj86iYxlog_eK2HZmhpkZsFvt8SSAl3gwmMDlSagyOwHkdYOpM5HcTTudAf0OGEbVbxuYdd_pJRg2NUolfHnEfI2WH1Z3kGnKMXEp8FpDOde6brPYPOsU9lUaWKCy0-q84zFPVjjkeG1YiMKRrViyBmvWn7mqniHswHqvSUWKTORfRRBBHZwOI67PW2bZIJguSXo3KZ",
    imageAlt: "Fresh organic green lettuce heads",
  },
  {
    id: "3",
    name: "Sweet Corn",
    harvestedDate: "Oct 10, 2023",
    quantity: "5.5 Tons",
    priceLabel: "Price/ton",
    priceValue: "$190",
    status: "In Stock",
    grade: "Grade B",
    category: "Grains",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpo2YEGZWEjmFV4CXB_91CU_7WN9RZcGDuhHoIAVXZQjFgqvVLlw1OzgwZBzTpnWwVAPeOMi0QMEjUrfFciquznZDZINCZdWI6_T8e-vS_Md63svDn-ZgahYpCXtKXNwraIKZr8qqRmPsja2Ehx90yiANT9u4dxctvYPZRiWBUBYl3rSsTqpOvbD-bCWTOC5ZhggAQmLULEMxprzITE_wr51b6IkCinVmSR7NFMjXC9NKq6RPvIrtTLJtIK6-bY_8xaGzeABAqOzu_",
    imageAlt: "Yellow ripe corn cobs stacked",
  },
  {
    id: "4",
    name: "Roma Tomatoes",
    harvestedDate: "Oct 15, 2023",
    quantity: "450 kg",
    priceLabel: "Price/kg",
    priceValue: "$1.50",
    status: "In Stock",
    grade: "Grade A",
    category: "Vegetables",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAogUobzpqZzaZdacGanCl5shP78YIV_6-yt4x6rseOwx7gL0CXpqFeTt9xUxtedk4RpQLrMO5_ylbZfnRhfVT0a8wWXIgYrXLAFVa_IjZD2zPSZGrlGt3R8JMZlOcuiJVdr8eKaxVxjPvtFCdgtLamOHY0q9a2POMwUNv-rFF_XqW102p3X3SrStt3ZxKYZbHs8hfFrLD5h2BcjzKqmWFqR5K1Lsu5sItJUfQsCObgbtY48GhX5ZrBXAwqZhcx46PGIPyOCiMfV3ZZ",
    imageAlt: "Close up of red ripe tomatoes",
  },
];

export const pendingOrders: PendingOrder[] = [
  { id: "1", buyerInitials: "FM", buyerName: "FreshMarkets", itemDescription: "200kg Tomatoes" },
  { id: "2", buyerInitials: "LG", buyerName: "Local Grocer", itemDescription: "50kg Onions" },
];

export const navItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "#" },
  { icon: "inventory_2", label: "My Harvests", href: "#", active: true },
  { icon: "shopping_bag", label: "Orders", href: "#", badge: 3 },
  { icon: "local_shipping", label: "Logistics", href: "#" },
  { icon: "analytics", label: "Market Prices", href: "#" },
];