import Link from 'next/link';
import { fetchAllCategories } from '@/utils/categoryService';

export interface ICategory {
  id: number;
  documentId: string;
  description: string;
  slug: string;
  createdAt: string; // ISO date strings can be typed as `string`
  updatedAt: string;
  publishedAt: string;
  title: string;
}

export default async function Categories() {
  const categories = await fetchAllCategories();

  const liClass =
    'border my-2 px-4 py-2 rounded-md hover:bg-slate-100 hover:cursor-pointer';

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">View All Categories</h1>
      <ul>
        {categories.map((category: ICategory) => (
          <li key={category.id} className={liClass}>
            <Link href={`category/${category.slug}`}>{category.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
