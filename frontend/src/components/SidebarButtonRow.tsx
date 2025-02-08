'use client';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

export default function SidebarButtonRow() {
  const isAuthenticated = useAuth();

  const menuRow = (
    <div>
      <div id="menu" className="flex justify-center gap-2 pt-2 pb-5">
        <button type="button" className="menu-btn">
          Add Recipe
        </button>
        <button type="button" className="menu-btn">
          Add Category
        </button>
      </div>
    </div>
  );

  return isAuthenticated ? menuRow : '';
}
