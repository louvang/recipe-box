'use client';

import { useEffect, useState } from 'react';
import Loading from './Loading';
import Link from 'next/link';

export default function SidebarCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) {
          throw new Error('Failed to get categories');
        }
        const data = await res.json();
        setCategories(data.data);
      } catch (error) {
        setError('Error fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  if (categories.length > 0) {
    return (
      <ul className="list-none border-t-[1px] border-neutral-300">
        {categories.map(
          (category: { id: string; name: string; slug: string }) => (
            <li className="category-li" key={category.id}>
              <Link href={`/category/${category.slug}`} className="li-link">
                {category.name}
              </Link>
              <Link
                href={`/category/${category.slug}/edit`}
                className="li-edit-btn"
              >
                Edit
              </Link>
            </li>
          )
        )}
      </ul>
    );
  } else {
    return (
      <div className="yellow-msg-box mx-4 mb-5">
        Sorry, there are no categories yet.
      </div>
    );
  }
}
