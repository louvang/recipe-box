import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { fetchRecipeBySlug } from '@/services/fetchRecipe';

export default async function SingleRecipe({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const recipe = await fetchRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="content text-lg">
      <Breadcrumbs />

      <div className="general-wrapper">
        <div className="general-content">
          <h1 className="text-4xl mb-1">{recipe.title}</h1>
        </div>
      </div>
    </div>
  );
}
