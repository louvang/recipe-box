'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Loading from '@/components/Loading';
import { GrStatusWarning } from 'react-icons/gr';

export default function AddCategoryPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>('');
  // const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setName(name.trim());
    setDescription(description.trim());

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

    // create slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    console.log({ name, description, slug });

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, slug }),
      });

      if (!res.ok) {
        setError(
          "Unable to create category. Are you sure that category name doesn't already exists?"
        );
        throw new Error(
          "Unable to create category. Are you sure that category name doesn't already exists?"
        );
      }

      router.push(`/category/${slug}`); // Redirect to new slug
    } catch (error) {
      console.error('Category creation error:', error);
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
    <div className="text-base px-3 py-2 red-msg-box font-bold flex items-center gap-2">
      <GrStatusWarning /> {error}
    </div>
  );

  return (
    <div className="content text-lg">
      <Breadcrumbs />

      <div className="general-wrapper">
        <div className="general-content">
          <h1 className="text-4xl mb-2 font-bold">Add Category</h1>

          <form onSubmit={handleAddCategory}>
            <label htmlFor="name" className="font-bold w-full mb-1 block">
              Category Name*
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
              Description
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

            <div className="flex items-center gap-4">
              <button type="submit" className="submit-btn text-xl">
                Add Category
              </button>
              {error ? errorBox : ''}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
