import type { Metadata } from 'next';
import CategoryEditPage from '@/components/Ministry/Categories/Edit/CategoryEditPageClient';

export const metadata: Metadata = {
  title:       'Edit Category | Ministry of Agriculture',
  description: 'Configure category name, slug, quality benchmarks, and taxonomic structures.',
};

export default function CategoryEditRoute() {
  return <CategoryEditPage />;
}