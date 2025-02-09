import { NextRequest, NextResponse } from 'next/server';
import sanitizeHtml from 'sanitize-html';

const STRAPI_URL = process.env.STRAPI_URL;
const API_URL = `${STRAPI_URL}/api/categories`;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_TOKEN}`,
};

// Get all categories (or filter by slug)
export async function GET(request: Request) {
  const url = new URL(request.url);
  console.log(url);
  const slug = url.searchParams.get('slug');
  const id = url.searchParams.get('id');

  if (slug) {
    // Fetch category by slug
    try {
      const encodedSlug = encodeURIComponent(slug);
      console.log(`${API_URL}?filters[slug][$eq]=${encodedSlug}`);
      const res = await fetch(`${API_URL}?filters[slug][$eq]=${encodedSlug}`);
      const data = await res.json();

      if (data.data.length === 0) {
        return new Response('Category not found', { status: 404 });
      }

      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response('Error fetching category by slug', { status: 500 });
    }
  } else if (id) {
    // Fetch by ID
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`);
      const data = await res.json();

      if (!data) {
        return new Response('Category not found', { status: 404 });
      }

      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response('Error fetching category by ID', { status: 500 });
    }
  } else {
    const res = await fetch(API_URL);
    const data = await res.json();
    return NextResponse.json(data);
  }
}

// Create a new category
export async function POST(req: NextRequest) {
  const { name, description, slug } = await req.json();
  // Check to make sure there are no duplicates
  const checkDuplicate = await fetch(`${API_URL}?filters[slug][$eq]=${slug}`, {
    headers,
  });

  const checkData = await checkDuplicate.json();

  if (checkData.data.length > 0) {
    return NextResponse.json(
      {
        error: 'Duplicate category found. Try a different name.',
      },
      { status: 400 }
    );
  }

  // Validate
  if (
    !name ||
    typeof name !== 'string' ||
    name.trim().length === 0 ||
    name.length > 36
  ) {
    console.log('name aint it');
    return NextResponse.json(
      { error: 'Invalid category name' },
      { status: 400 }
    );
  }

  if (typeof description !== 'string' || description.length > 200) {
    console.log('description aint it');
    return NextResponse.json(
      { error: 'Invalid category description' },
      { status: 400 }
    );
  }

  // Sanitize
  const sanitizedName = sanitizeHtml(name.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });

  const sanitizedDesc = sanitizeHtml(description.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });

  const sanitizedSlug = sanitizeHtml(slug.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });

  // Post
  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      data: {
        name: sanitizedName,
        description: sanitizedDesc,
        slug: sanitizedSlug,
      },
    }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
