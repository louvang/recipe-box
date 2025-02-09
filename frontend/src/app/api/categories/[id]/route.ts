import { NextRequest, NextResponse } from 'next/server';
import sanitizeHtml from 'sanitize-html';

const STRAPI_URL = process.env.STRAPI_URL;
const API_URL = `${STRAPI_URL}/api/categories`;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_TOKEN}`,
};

// Get a single category by id
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await fetch(`${API_URL}/${params.id}`, { headers });
  const data = await res.json();
  return NextResponse.json(data);
}

// Update a category
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { name, description, slug } = await req.json();

  // Check to make sure there are no duplicates
  const checkDuplicate = await fetch(`${API_URL}?filters[slug][$eq]=${slug}`, {
    headers,
  });

  const checkData = await checkDuplicate.json();

  if (checkData.data.length > 0) {
    // Duplicate exists, but exclude the current category itself
    const isDuplicate = checkData.data.some(
      (category: { documentId: string }) => category.documentId !== params.id
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: 'Duplicate category found. Try a different name.' },
        { status: 400 }
      );
    }
  }

  // Validate
  if (
    !name ||
    typeof name !== 'string' ||
    name.trim().length === 0 ||
    name.length > 36
  ) {
    return NextResponse.json(
      { error: 'Invalid category name' },
      { status: 400 }
    );
  }

  if (typeof description !== 'string' || description.length > 200) {
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

  const res = await fetch(`${API_URL}/${params.id}`, {
    method: 'PUT',
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

// Delete a category
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await fetch(`${API_URL}/${params.id}`, {
    method: 'DELETE',
    headers,
  });

  if (res.ok) {
    return NextResponse.json({ message: 'Category deleted' }, { status: 200 });
  } else if (res.status === 404) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  } else {
    const errorData = await res.json();
    return NextResponse.json(
      { error: errorData?.error?.message || 'Unable to delete category.' },
      { status: res.status }
    );
  }
}
