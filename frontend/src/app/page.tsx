'use client';

import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Home() {
  const pathname = usePathname();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/recipes');
      if (!res.ok) {
        throw new Error('Failed to get recipes');
      }
      const data = await res.json();
      console.log(data);
      setRecipes(data.data);
    } catch (error) {
      setError('Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [pathname]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  if (recipes.length > 0) {
    return (
      <div className="content text-lg">
        <div className="py-2 px-3 mb-12">All Recipes</div>
        <div className="general-wrapper">
          <div className="general-content">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recipes.map(
                (recipe: {
                  id: string;
                  documentId: string;
                  title: string;
                  description: string | null;
                  slug: string;
                }) => (
                  <li
                    key={recipe.id}
                    className="recipe-li rounded-2xl p-4 flex flex-wrap content-between"
                  >
                    <div className="w-full">
                      <Link
                        href={`/recipe/${recipe.slug}`}
                        className="text-3xl"
                      >
                        {recipe.title}
                      </Link>

                      <p className="recipe-li-description">
                        {recipe.description || 'No description.'}
                      </p>
                    </div>

                    <div className="w-full">
                      <Link
                        href={`/recipe/${recipe.slug}`}
                        className="goto-btn"
                      >
                        View Recipe &raquo;
                      </Link>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="yellow-msg-box m-6">Sorry, there are no recipes yet.</div>
    );
  }
}
