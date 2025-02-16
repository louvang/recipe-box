export const fetchRecipeBySlug = async (slug: string) => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/recipes?slug=${slug}`);
    const data = await res.json();
    return data.data.length > 0 ? data.data[0] : null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
};
