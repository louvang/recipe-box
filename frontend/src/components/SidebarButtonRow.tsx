'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function SidebarButtonRow() {
  const { isAuthenticated } = useAuth();

  const menuRow = (
    <div>
      <div id="menu" className="flex justify-center gap-2 pt-2 pb-5">
        <Link href="/recipe/add" className="menu-btn">
          Add Recipe
        </Link>
        <Link href="/category/add" className="menu-btn">
          Add Category
        </Link>
      </div>
    </div>
  );

  return isAuthenticated ? menuRow : '';
}
