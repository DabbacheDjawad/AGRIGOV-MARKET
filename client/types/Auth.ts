export type UserRole = "Farmer" | "Buyer" | "Transporter" | "Ministry";

export interface RoleOption {
  id: UserRole;
  icon: string;
  label: string;
}

export interface StatBadge {
  value: string;
  label: string;
}


export const roleOptions: RoleOption[] = [
  { id: "Farmer", icon: "grass", label: "Farmer" },
  { id: "Buyer", icon: "storefront", label: "Buyer" },
  { id: "Transporter", icon: "local_shipping", label: "Transporter" },
  { id: "Ministry", icon: "account_balance", label: "Ministry" },
];

export const heroStats: StatBadge[] = [
  { value: "2.4M+", label: "Registered Farmers" },
  { value: "100%", label: "Verified Buyers" },
];