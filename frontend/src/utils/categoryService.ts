export async function fetchAllCategories() {
  const res = await fetch(`${process.env.STRAPI_URL}/api/categories`, {
    cache: 'force-cache', // Data is fetched only once at build time
  });
  if (!res.ok) {
    throw new Error('Failed to fetch all categories');
  }
  const data = await res.json();
  return data.data;
}

export async function fetchSingleCategory(slug: string) {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/categories?[slug][$eq]=${slug}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch category with slug '${slug}'`);
  }
  const data = await res.json();
  return data;
}
