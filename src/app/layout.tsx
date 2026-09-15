import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CivicLens',
  description: 'CivicLens turns real-world civic problems into verified, trackable incidents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
