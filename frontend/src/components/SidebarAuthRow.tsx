'use client';
import Link from 'next/link';
import { GrLogin, GrLogout } from 'react-icons/gr';
import { useAuth } from '@/context/AuthContext';

export default function SidebarAuthRow() {
  const { isAuthenticated } = useAuth();

  const handleLogout = async () => {
    const res = await fetch('api/logout', {
      method: 'POST',
    });

    if (res.ok) {
      window.location.reload();
    }
  };

  const loginBtn = (
    <Link href="/login" className="log-link font-bold flex gap-2 items-center">
      <GrLogin /> Login
    </Link>
  );

  const logoutBtn = (
    <button onClick={handleLogout} className="log-link flex gap-2 items-center">
      Logout <GrLogout />
    </button>
  );

  return isAuthenticated ? logoutBtn : loginBtn;
}
