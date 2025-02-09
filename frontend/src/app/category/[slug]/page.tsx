import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { fetchCategoryBySlug } from '@/services/fetchCategory';

export default async function SingleCategory({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const noDescPlaceholder = <span className="italic">No description</span>;

  return (
    <div className="content text-lg">
      <Breadcrumbs />

      <div className="general-wrapper">
        <div className="general-content">
          <h1 className="text-4xl mb-1">{category.name}</h1>
          <p>
            {category.description ? category.description : noDescPlaceholder}
          </p>
        </div>
      </div>
    </div>
  );
}
