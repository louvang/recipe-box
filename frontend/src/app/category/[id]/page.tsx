"use client";

import { useRouter } from 'next/navigation';

export default function Category() {
  const router = useRouter();

  console.log(router)

  return <div>Display list of recipes in category of &quot;id&quot;! You are in the category: </div>;
}
