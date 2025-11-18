import type { Metadata } from 'next';
import './globals.css';
import { Inter, Atkinson_Hyperlegible } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const atkinson = Atkinson_Hyperlegible({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-atkinson' });

export const metadata: Metadata = {
  title: 'Readable ? Make Everything Readable',
  description: 'Adjustable typography, spacing, and contrast to make everything readable.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${atkinson.variable}`}>
        {children}
      </body>
    </html>
  );
}
