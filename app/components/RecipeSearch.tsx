'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Recipe {
  id: number;
  title: string;
  image: string;
  summary: string;
}

export default function RecipeSearch() {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRecipes = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/recipes/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setRecipes(data.results);
    } catch (error) {
      console.error('Failed to search recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={searchRecipes} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border rounded-lg overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.title}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
              <div
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
                className="text-sm text-gray-600"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 