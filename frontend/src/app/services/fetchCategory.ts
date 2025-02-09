export const fetchCategoryBySlug = async (slug: string) => {
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/categories?slug=${slug}`
    );
    const data = await res.json();
    return data.data.length > 0 ? data.data[0] : null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
};
