import { NextResponse } from 'next/server';
import sanitizeHtml from 'sanitize-html';

const STRAPI_URL = process.env.STRAPI_URL;
const API_URL = `${STRAPI_URL}/api/recipes`;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_TOKEN}`,
};

// Get all recipes (or filter by slug)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  const id = url.searchParams.get('id');

  if (slug) {
    // Fetch recipe by slug
    try {
      const encodedSlug = encodeURIComponent(slug);
      console.log(`${API_URL}?filters[slug][$eq]=${encodedSlug}`);
      const res = await fetch(`${API_URL}?filters[slug][$eq]=${encodedSlug}`);
      const data = await res.json();

      if (data.data.length === 0) {
        return new Response('Recipe not found', { status: 404 });
      }

      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response('Error fetching category by slug', { status: 500 });
    }
  } else if (id) {
    // Fetch by ID
    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}`);
      const data = await res.json();

      if (!data) {
        return new Response('Recipe not found', { status: 404 });
      }

      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response('Error fetching recipe by ID', { status: 500 });
    }
  } else {
    const res = await fetch(API_URL);
    const data = await res.json();
    return NextResponse.json(data);
  }
}

// Create new recipe
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const strapiRes = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: body }),
    });

    if (!strapiRes.ok) {
      const errorData = await strapiRes.json();
      return NextResponse.json(
        { error: 'Failed to create recipe', details: errorData },
        { status: strapiRes.status }
      );
    }

    const responseData = await strapiRes.json();
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
