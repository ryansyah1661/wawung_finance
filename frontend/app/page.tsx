import { redirect } from 'next/navigation';

export default function RootPage() {
  // Langsung arahkan halaman utama ke /login
  redirect('/login');
}