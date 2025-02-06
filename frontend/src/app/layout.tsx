import type { Metadata } from 'next';
import { Gloock, Syne } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import { GrLogin, GrLogout } from 'react-icons/gr';

const gloock = Gloock({
  weight: '400',
  subsets: ['latin'],
});

const syne = Syne({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Delibox',
  description: 'Recipe management for minimalists',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.className} antialiased text-base`}>
        <div id="container" className="flex">
          <div
            id="sidebar"
            className="border-r-[1px] border-neutral-300 bg-neutral-100 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 h-screen sticky top-0"
          >
            <div id="logo" className="flex flex-wrap justify-center pt-4 pb-2">
              <div className="w-full flex justify-center pb-2">
                <Image src="/logo-icon.png" alt="" width={50} height={50} />
              </div>

              <div className={`${gloock.className} antialiased text-6xl`}>
                Delibox
              </div>

              <div className="pt-1 uppercase tracking-wide font-bold text-xs">
                Recipe Management
              </div>
            </div>

            <div id="menu" className="flex justify-center gap-2 pt-2 pb-5">
              {/** If logged in */}
              <button type="button" className="menu-btn">
                Add Recipe
              </button>
              <button type="button" className="menu-btn">
                Add Category
              </button>
            </div>

            <div
              id="categories"
              className="overflow-auto"
              style={{ maxHeight: 'calc(100vh - 216px - 51px)' }}
            >
              {/** If no categories */}
              <div className="yellow-msg-box mx-4 mb-5">
                Sorry, there are no categories yet.
              </div>

              {/* <ul className="list-none border-t-[1px] border-neutral-300">
                <li className="category-li">
                  <Link href="/" className="li-link">
                    Category 1 (##)
                  </Link>
                  <button type="button" className="li-edit-btn">
                    Edit
                  </button>
                </li>
              </ul> */}
            </div>

            <div className="bottom-0 absolute w-full border-t border-neutral-300 bg-neutral-100 p-3 flex justify-center">
              {/* If logged out */}
              <Link
                href="/login"
                className="log-link font-bold flex gap-2 items-center"
              >
                <GrLogin /> Login
              </Link>

              {/* If logged in */}
              {/* <Link href="/logout" className="log-link flex gap-2 items-center">
                Logout <GrLogout />
              </Link> */}
            </div>
          </div>
          <div id="content" className="p-6 sm:w-1/2 md:w-2/3 lg:w-3/4 xl:w-4/5">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
