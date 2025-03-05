import { redirect } from 'next/navigation';

export default function Home() {
  // Temporarily redirect to dashboard without auth
  redirect('/dashboard');
  return null;
}