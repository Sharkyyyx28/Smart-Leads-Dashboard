import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import type { ApiResponse, User } from '../types';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { data } = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', values);
      if (data.data) {
        setAuth(data.data.user, data.data.token);
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch {
      // API client handles toast error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-50 dark:bg-dark-950 transition-colors duration-200 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Sign In to Smart Leads</h2>
          <p className="text-sm text-dark-500 dark:text-dark-400">
            Access your enterprise lead management dashboard
          </p>
        </div>

        {/* Demo Credentials Notice */}
        <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900/50 text-xs text-brand-800 dark:text-brand-300 space-y-1">
          <p className="font-semibold mb-1">📌 Demo Accounts:</p>
          <p>Admin: <span className="font-mono font-bold">admin@smartleads.com</span> / <span className="font-mono font-bold">admin123</span></p>
          <p>Sales: <span className="font-mono font-bold">rahul@smartleads.com</span> / <span className="font-mono font-bold">sales123</span></p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="admin@smartleads.com"
              className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-dark-500 dark:text-dark-400 border-t border-dark-100 dark:border-dark-800 pt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
