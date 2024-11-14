export async function fetchAllCategries() {
  const res = await fetch(`${process.env.STRAPI_URL}/api/categories`);
  if (!res.ok) {
    throw new Error('Failed to fetch all categories');
  }
  const data = await res.json();
  return data;
}

export async function fetchSingleCategory(id: string) {
  const res = await fetch(`${process.env.STRAPI_URL}/api/categories/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch category with id '${id}'`);
  }
  const data = await res.json();
  return data;
}
