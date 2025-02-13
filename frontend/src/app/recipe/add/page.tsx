'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Loading from '@/components/Loading';
import { GrStatusWarning } from 'react-icons/gr';

export default function AddRecipePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [instructions, setInstructions] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [source, setSource] = useState('');
  const [error, setError] = useState<string | null>('');

  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

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

  useEffect(() => {
    fetchCategories();
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleAddIngredient = () => {
    if (newIngredient) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient('');
    }
  };

  const handleEditIngredient = (index: number, newValue: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = newValue;
    setIngredients(updatedIngredients);
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const handleAddInstruction = () => {
    if (newInstruction) {
      setInstructions([...instructions, newInstruction]);
      setNewInstruction('');
    }
  };

  const handleEditInstruction = (index: number, newValue: string) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = newValue;
    setInstructions(updatedInstructions);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId) // Remove if already selected
          : [...prev, categoryId] // Add if not selected
    );
  };

  const handleAddRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim() || title.length < 3 || title.length > 120) {
      setError('Title must be between 3 and 120 characters.');
      return;
    }

    const recipeData = {
      title,
      description,
      ingredients: JSON.stringify(ingredients),
      instructions: JSON.stringify(instructions),
      source: source.trim(),
      slug: title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
      categories: selectedCategories, // Array of category IDs
    };

    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
      });

      if (!res.ok) {
        throw new Error('Failed to add recipe');
      }

      const data = await res.json();
      router.push(`/recipe/${data.slug}`);
    } catch (err) {
      setError('Error adding recipe');
      console.error(err);
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

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="content text-lg">
      <Breadcrumbs />

      <div className="general-wrapper">
        <div className="general-content">
          <h1 className="text-4xl mb-6 font-bold">Add Recipe</h1>

          <form onSubmit={handleAddRecipe}>
            <label htmlFor="name" className="font-bold w-full mb-1 block">
              Recipe Title
            </label>

            <input
              id="name"
              type="text"
              placeholder="Title of recipe"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field w-full mb-4"
              minLength={3}
              maxLength={120}
              required
            />

            <div className="mb-4">
              <div className="font-bold w-full mb-1 block">
                Add to Categories
              </div>

              <div className="flex justify-between flex-wrap">
                {categories.map(
                  (category: {
                    id: string;
                    name: string;
                    documentId: string;
                    slug: string;
                  }) => (
                    <div key={category.id}>
                      <input
                        type="checkbox"
                        id={category.slug}
                        name={category.slug}
                        value={category.name}
                        className="cursor-pointer"
                        checked={selectedCategories.includes(
                          parseInt(category.id)
                        )}
                        onChange={() =>
                          handleCategoryChange(parseInt(category.id))
                        }
                      />
                      <label
                        htmlFor={category.slug}
                        className="cursor-pointer pl-2"
                      >
                        {category.name}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>

            <label htmlFor="desc" className="font-bold w-full mb-1 block">
              Description
            </label>

            <textarea
              id="desc"
              placeholder="Briefly introduce the recipe"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field w-full mb-2"
              rows={3}
            />

            <div className="ingredients mb-6">
              <div className="font-bold w-full mb-1 block">Ingredients</div>
              <ul>
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="mb-2">
                    <input
                      type="text"
                      className="input-field-condensed array-inputs"
                      value={ingredient}
                      onChange={(e) =>
                        handleEditIngredient(index, e.target.value)
                      }
                    />
                    <button
                      className="ml-2 outline-btn"
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <input
                type="text"
                className="input-field-condensed array-inputs"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Ingredient (e.g. 1 cup of flour)"
              />
              <button
                className="ml-2 sub-btn"
                type="button"
                onClick={handleAddIngredient}
              >
                Add Ingredient
              </button>
            </div>

            <div className="instructions mb-6">
              <div className="font-bold w-full mb-1 block">Instructions</div>
              <div className="instruction-list">
                {instructions.map((instruction, index) => (
                  <div key={index} className="mb-2 flex gap-2 items-start">
                    <div className="text-right">{index + 1}.</div>
                    <textarea
                      className="input-field-condensed array-inputs"
                      value={instruction}
                      onChange={(e) =>
                        handleEditInstruction(index, e.target.value)
                      }
                      rows={2}
                    />
                    <button
                      className="ml-2 outline-btn"
                      type="button"
                      onClick={() => handleRemoveInstruction(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="instruction-list mb-6">
                <div className="mb-2 flex gap-2 items-center">
                  <div className="text-right">+</div>
                  <textarea
                    className="input-field-condensed array-inputs"
                    value={newInstruction}
                    placeholder="Mix dry ingredients in a large bowl."
                    onChange={(e) => setNewInstruction(e.target.value)}
                    rows={2}
                  />

                  <button
                    className="ml-2 sub-btn"
                    type="button"
                    onClick={handleAddInstruction}
                  >
                    Add Step
                  </button>
                </div>
              </div>

              <label htmlFor="name" className="font-bold w-full block">
                Source (Who made this recipe?)
              </label>

              <input
                id="name"
                type="text"
                placeholder="Grandma Song"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="input-field w-full"
                maxLength={120}
              />
            </div>

            <div className="flex items-center gap-4">
              <button type="submit" className="submit-btn text-xl">
                Add Recipe
              </button>
              {error ? errorBox : ''}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
