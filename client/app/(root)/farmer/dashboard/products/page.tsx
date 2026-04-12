import type { Metadata } from 'next';
import ProductManagementPage from '@/components/Inventory/Products/InventoryClientPage';

export const metadata: Metadata = {
  title:       'Product Management | AgriManager',
  description: 'Review and manage your marketplace listings',
};

export default function ProductManageRoute() {
  return <ProductManagementPage />;
}