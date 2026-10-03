import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerSchema } from '../schemas/validationSchemas';
import { setCredentials } from '../store/authSlice';
import { useRegisterMutation } from '../api/devflowApi';
import { Code2, Lock, Mail, User, Shield, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [errorMsg, setErrorMsg] = useState('');
  const [registerApi] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'DEVELOPER',
    },
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      const res = await registerApi({
        fullName: data.fullName,
        name: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      }).unwrap();

      dispatch(setCredentials({
        token: res.token,
        user: res.user,
      }));
      navigate('/app/dashboard');
    } catch (err) {
      console.warn('Backend register attempt:', err);
      const serverMsg = err?.data?.error || err?.error;
      if (serverMsg) {
        setErrorMsg(serverMsg);
      } else {
        setErrorMsg('Unable to register user with the backend service. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-purple-600/20 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/30 mb-3">
            <Code2 className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create DevFlow Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join high-performing developer squads</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                {...register('fullName')}
                type="text"
                placeholder="Sarah Jenkins"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-rose-400">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                {...register('email')}
                type="email"
                placeholder="sarah@company.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                {...register('password')}
                type="password"
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Persona</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Shield className="h-4 w-4" />
              </div>
              <select
                {...register('role')}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              >
                <option value="DEVELOPER">Developer (Contributor)</option>
                <option value="PROJECT_MANAGER">Project Manager (Scrum Master)</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Complete Sign Up'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
