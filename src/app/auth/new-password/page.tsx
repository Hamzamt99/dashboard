'use client';
import React, { useState } from 'react';
import { apiClient } from '@/customApi/auth.api';
import { useRouter } from 'next/navigation';
import Spinner from '@/svg/spinner';
import EyeIcon from '@/svg/eye';
import EyeOffIcon from '@/svg/eyeOff';

const NewPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'password') {
      setNewPassword(e.target.value);
    } else if (e.target.name === 'confirmPassword') {
      setConfirmPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const email = localStorage.getItem('email');
      setLoading(true);
      const response = await apiClient.post('/reset-password', {
        newPassword: password,
        email: email,
      });
      if (response.status === 200) {
        // router.push('/auth/signin');
      } else {
        setError(response);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-1/2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 shadow-sm -space-y-px">
                <h2 className="text-center text-3xl font-extrabold mb-4">
                  Reset your password
                </h2>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="New Password"
                    value={password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-4 text-sm text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-4 shadow-sm -space-y-px">
                <div className="relative">
                  <label htmlFor="confirmPassword" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-4 text-sm text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {error && <p className="mt-2 text-sm text-red">{error}</p>}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-2 text-white transition hover:bg-opacity-90 flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner className="w-6 h-6 animate-spin" />
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
