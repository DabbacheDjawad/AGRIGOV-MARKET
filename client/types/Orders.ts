export type OrderStatus = "Delivered" | "In Transit" | "Pending" | "Cancelled";

export interface Order {
  id: string;
  orderId: string;
  date: string;
  supplier: string;
  product: string;
  productDetail: string;
  amount: number;
  status: OrderStatus;
}

export interface InvoiceLineItem {
  id: string;
  label: string;
  amount: number;
}

export interface InvoiceDetail {
  orderId: string;
  status: OrderStatus;
  supplierName: string;
  supplierReg: string;
  supplierAddress: string;
  lineItems: InvoiceLineItem[];
  total: number;
  mapImageUrl: string;
  routeLabel: string;
  generatedOn: string;
}



export const orders: Order[] = [
  {
    id: "1",
    orderId: "#AG-8492",
    date: "Oct 24, 2023",
    supplier: "Sunnydale Farms",
    product: "Wheat (Grade A)",
    productDetail: "500kg Bulk",
    amount: 1250.0,
    status: "Delivered",
  },
  {
    id: "2",
    orderId: "#AG-8488",
    date: "Oct 20, 2023",
    supplier: "Highland Fertilizers",
    product: "NPK 15-15-15",
    productDetail: "20 Sacks",
    amount: 840.0,
    status: "In Transit",
  },
  {
    id: "3",
    orderId: "#AG-8301",
    date: "Oct 15, 2023",
    supplier: "AgroMachinery Ltd",
    product: "Tractor Parts",
    productDetail: "Hydraulic Pump",
    amount: 2100.0,
    status: "Pending",
  },
  {
    id: "4",
    orderId: "#AG-8299",
    date: "Oct 12, 2023",
    supplier: "River Valley Seeds",
    product: "Corn Seeds",
    productDetail: "Hybrid Variety X",
    amount: 450.0,
    status: "Delivered",
  },
  {
    id: "5",
    orderId: "#AG-8255",
    date: "Oct 05, 2023",
    supplier: "ChemGrow Ind.",
    product: "Pesticide",
    productDetail: "20L Drum",
    amount: 320.0,
    status: "Cancelled",
  },
];

export const invoiceDetails: Record<string, InvoiceDetail> = {
  "1": {
    orderId: "#AG-8492",
    status: "Delivered",
    supplierName: "Sunnydale Farms",
    supplierReg: "AG-2938-XX",
    supplierAddress: "12 Farm Road, Crop District",
    lineItems: [
      { id: "wheat", label: "Wheat (Grade A) x 500kg", amount: 1150.0 },
      { id: "transport", label: "Transportation Fee", amount: 80.0 },
      { id: "tax", label: "Platform Service Tax (2%)", amount: 20.0 },
    ],
    total: 1250.0,
    mapImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCH2v_oFvhO32irvxZzxAqtkpJIMBM8zC3kgZvsfD18B_ucBjgV1T-vx7AM-oeY0Os-H6xyaHvFpNCH5S9Dgrck9YB2xVd6hpcaT5kipM6yPBrS3VlhfZNPE8B8VD3g8QBO234W72Qki6CHF34311nAHqABW1pYXFb-oWXDIfU1uJWBkd68L8LAnuyU7bTxr52ZYjpYWzC5MfJy2c6RHk90nu7eiAmgToakKKSHXJ-JnyBke8eIO8pv4FgC_PMtAteVp2cg6M7jTLbq",
    routeLabel: "Route Completed",
    generatedOn: "Oct 25, 2023",
  },
  "2": {
    orderId: "#AG-8488",
    status: "In Transit",
    supplierName: "Highland Fertilizers",
    supplierReg: "AG-3112-HF",
    supplierAddress: "48 Highland Ave, Agri Zone",
    lineItems: [
      { id: "npk", label: "NPK 15-15-15 x 20 Sacks", amount: 760.0 },
      { id: "transport", label: "Transportation Fee", amount: 65.0 },
      { id: "tax", label: "Platform Service Tax (2%)", amount: 15.0 },
    ],
    total: 840.0,
    mapImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCH2v_oFvhO32irvxZzxAqtkpJIMBM8zC3kgZvsfD18B_ucBjgV1T-vx7AM-oeY0Os-H6xyaHvFpNCH5S9Dgrck9YB2xVd6hpcaT5kipM6yPBrS3VlhfZNPE8B8VD3g8QBO234W72Qki6CHF34311nAHqABW1pYXFb-oWXDIfU1uJWBkd68L8LAnuyU7bTxr52ZYjpYWzC5MfJy2c6RHk90nu7eiAmgToakKKSHXJ-JnyBke8eIO8pv4FgC_PMtAteVp2cg6M7jTLbq",
    routeLabel: "En Route",
    generatedOn: "Oct 21, 2023",
  },
};