import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const diet = searchParams.get('diet');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const spoonacularUrl = new URL('https://api.spoonacular.com/recipes/complexSearch');
    spoonacularUrl.searchParams.append('apiKey', process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY!);
    spoonacularUrl.searchParams.append('query', query);
    if (diet) spoonacularUrl.searchParams.append('diet', diet);
    spoonacularUrl.searchParams.append('addRecipeInformation', 'true');

    const response = await fetch(spoonacularUrl);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch recipes');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Recipe search error:', error);
    return NextResponse.json({ error: 'Failed to search recipes' }, { status: 500 });
  }
} 