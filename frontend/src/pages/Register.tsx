import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import type { ApiResponse, User } from '../types';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Sales User']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Sales User',
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const { data } = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', values);
      if (data.data) {
        setAuth(data.data.user, data.data.token);
        toast.success('Account created successfully!');
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
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Create an Account</h2>
          <p className="text-sm text-dark-500 dark:text-dark-400">
            Join Smart Leads as an Admin or Sales Representative
          </p>
        </div>

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
              Full Name
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="john@example.com"
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

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
              Account Role
            </label>
            <select
              {...register('role')}
              className="w-full px-4 py-3 rounded-xl border border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="Sales User">Sales User</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-dark-500 dark:text-dark-400 border-t border-dark-100 dark:border-dark-800 pt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
