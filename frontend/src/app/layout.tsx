import type { Metadata } from 'next';
import { Gloock, Syne } from 'next/font/google';
import Image from 'next/image';
import './globals.css';
import Link from 'next/link';
import { AuthProvider } from '@/context/AuthContext';
import SidebarButtonRow from '@/components/SidebarButtonRow';
import SidebarAuthRow from '@/components/SidebarAuthRow';
import SidebarCategories from '@/components/SidebarCategories';

const gloock = Gloock({
  weight: '400',
  subsets: ['latin'],
});

const syne = Syne({
  weight: '400',
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
        <AuthProvider>
          <div id="container" className="flex">
            <div
              id="sidebar"
              className="border-r-[1px] border-neutral-300 bg-neutral-100 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 h-screen sticky top-0"
            >
              <Link href="/">
                <div
                  id="logo"
                  className="flex flex-wrap justify-center pt-4 pb-2"
                >
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
              </Link>

              <SidebarButtonRow />

              <div
                id="categories"
                className="overflow-auto"
                style={{ maxHeight: 'calc(100vh - 216px - 51px)' }}
              >
                <SidebarCategories />
              </div>

              <div className="bottom-0 absolute w-full border-t border-neutral-300 bg-neutral-100 p-3 flex justify-center">
                <SidebarAuthRow />
              </div>
            </div>
            <div id="content" className="sm:w-1/2 md:w-2/3 lg:w-3/4 xl:w-4/5">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
