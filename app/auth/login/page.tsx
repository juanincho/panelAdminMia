import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login - Sistema de Reservas',
  description: 'Login al panel de administración',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sistema de Reservas
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede al panel de administración
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}