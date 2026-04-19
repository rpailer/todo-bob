import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TODO App',
  description: 'A simple and efficient todo application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}

// Made with Bob
