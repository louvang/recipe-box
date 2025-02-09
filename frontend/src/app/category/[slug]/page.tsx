import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { fetchCategoryBySlug } from '@/services/fetchCategory';
// import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default async function SingleCategory({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  // const { isAuthenticated } = useAuth();

  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const noDescPlaceholder = <span className="italic">No description</span>;
  const editBtn = (
    <Link
      href={`/category/edit/${category.documentId}`}
      className="text-md px-3 py-1 rounded-xl border border-neutral-900 bg-neutral-900 text-neutral-100"
    >
      Edit
    </Link>
  );

  return (
    <div className="content text-lg">
      <Breadcrumbs />

      <div className="general-wrapper">
        <div className="general-content">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl mb-1">{category.name}</h1>
            {editBtn}
          </div>

          <p>
            {category.description ? category.description : noDescPlaceholder}
          </p>
        </div>
      </div>
    </div>
  );
}
