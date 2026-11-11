import type { Metadata } from 'next';
import { SecretPage } from '@/components/easter-eggs/SecretPage';

export const metadata: Metadata = {
  title: 'Capítulo secreto',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SecretPage />;
}
