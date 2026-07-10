import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== 'admin') {
    redirect('/login');
  }
  return session;
}
