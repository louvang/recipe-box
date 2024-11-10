import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Recipe Box',
  description: 'My go-to recipes in one spot',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navClass = `border-b-4 w-1/5 px-4 py-3 uppercase tracking-widest font-bold rounded-t-md hover:bg-slate-200 hover:border-slate-700`;

  return (
    <html lang="en">
      <body className={inter.className + ' items-center flex flex-wrap h-lvh'}>
        <div className="container mx-auto max-w-screen-lg">
          <Link href="/">
            <h1 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mt-6 mb-4">
              Recipe Box
            </h1>
          </Link>

          <div className="box border rounded-lg shadow-md p-4 bg-slate-50 mb-16">
            <nav className="flex place-content-between mb-2">
              <Link href="/category/breakfast" className={navClass}>
                Breakfast
              </Link>
              <Link href="/category/lunch" className={navClass}>
                Lunch
              </Link>
              <Link href="/category/dinner" className={navClass}>
                Dinner
              </Link>
              <Link href="/category/snacks" className={navClass}>
                Snacks
              </Link>
              <Link href="/category/all-tags" className={navClass}>
                All Tags
              </Link>
            </nav>
            <div className="box-content p-4">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
