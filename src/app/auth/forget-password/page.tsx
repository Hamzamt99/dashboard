'use client';
import React, { useState } from 'react';
import { apiClient } from '@/customApi/auth.api';
import { useRouter } from 'next/navigation';
import Spinner from '@/svg/spinner';

const ForgetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>({});
  const [email, setEmail] = useState('');

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});
    try {
      setLoading(true);
      const response = await apiClient.post('/forget-password', {
        email: email,
      });
      if (response.status === 200) {
        localStorage.setItem('email', email);
        router.push('/auth/otp');
      } else {
        const errorObj: any = {};
        response.errors.forEach((error: any) => {
          errorObj[error.path] = error.msg;
        });
        setError(errorObj);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-1/2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="text-center text-3xl font-extrabold">
              Forget your password?
            </h2>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    required
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Email"
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                {error && error.email && (
                  <p className="mt-2 text-sm text-red">{error.email}</p>
                )}
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
                    'Send OTP'
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

export default ForgetPassword;
