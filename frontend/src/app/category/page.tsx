import Link from 'next/link';

async function fetchCategories() {
  const res = await fetch(`${process.env.STRAPI_URL}/api/categories`, {
    cache: 'force-cache', // Data is fetched only once at build time
  });
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await res.json();
  return data.data;
}

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
  const categories = await fetchCategories();

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
