'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Breadcrumbs from '@/components/Breadcrumbs';
import Loading from '@/components/Loading';
import { GrStatusWarning } from 'react-icons/gr';

export default function EditCategoryPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = use(paramsPromise);
  const [initName, setInitName] = useState('');
  const [initDescription, setInitDescription] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }

    async function fetchCategory() {
      try {
        const res = await fetch(`/api/categories/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch category');
        const data = await res.json();
        setInitName(data.data.name);
        setInitDescription(data.data.description);
        setName(data.data.name);
        setDescription(data.data.description);
      } catch (error) {
        setError('Failed to get category data');
      }
    }

    fetchCategory();
  }, [isAuthenticated, router]);

  const handleEditCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setName(name.trim());
    setDescription(description.trim());

    if (initName === name && initDescription === description) {
      setError('There are no changes to make.');
      return;
    }

    if (name === '') {
      setError('Category name is required.');
      return;
    }

    if (name.length < 4) {
      setError('Category name is too short. Minimum: 3 characters');
      return;
    }

    if (name.length > 36) {
      setError('Category name is too long. Max: 32 characters');
      return;
    }

    if (description.length > 200) {
      setError('Description is too long. Max: 200 characters');
    }

    // Create slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    try {
      const res = await fetch(`/api/categories/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, slug }),
      });

      if (!res.ok) {
        setError('Unable to edit category.');
        throw new Error('Unable to edit category.');
      }

      router.push(`/category/${slug}`); // Redirect to new slug
    } catch (error) {
      console.error('Category edit error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Something unexpected happened. Try again.'
      );
    }
  };

  const handleDeleteCategory = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this category? This cannot be undone!'
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/categories/${params.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json(); // Get the error message from the response
        setError(errorData?.error?.message || 'Unable to delete category.');
        console.error('Error response:', errorData);
        throw new Error('Unable to delete category.');
      }

      router.push('/');
    } catch (error) {
      console.error('Category delete error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Something unexpected happened. Try again.'
      );
    }
  };

  if (!isAuthenticated) {
    return <Loading />;
  }

  const errorBox = (
    <div className="text-base px-3 py-2 mb-3 red-msg-box font-bold flex items-center gap-2">
      <GrStatusWarning /> {error}
    </div>
  );

  return (
    <div className="content text-lg">
      <Breadcrumbs />

      <div className="general-wrapper">
        <div className="general-content">
          <h1 className="text-4xl mb-6 font-bold">Edit Category</h1>

          <form onSubmit={handleEditCategory}>
            <label htmlFor="name" className="font-bold w-full mb-1 block">
              Edit Category Name*
            </label>

            <input
              id="name"
              type="text"
              placeholder="Desserts"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full mb-4"
              minLength={3}
              maxLength={36}
              required
            />

            <label htmlFor="desc" className="font-bold w-full mb-1 block">
              Edit Description
            </label>

            <textarea
              id="desc"
              placeholder="Briefly describe this category"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field w-full mb-4"
              maxLength={200}
              rows={2}
            />

            {error ? errorBox : ''}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="submit-btn text-xl"
                  disabled={
                    initName === name && initDescription === description
                  }
                >
                  Edit Category
                </button>
              </div>

              <button
                type="button"
                className="delete-btn text-xl"
                onClick={handleDeleteCategory}
              >
                Delete Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
