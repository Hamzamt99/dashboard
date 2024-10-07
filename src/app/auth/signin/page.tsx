'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/customApi/auth.api';
import {
  rememberMe,
  getRememberMeData,
  removeFromLocalStorage,
} from '@/utils/save-to-local-storage';
import { useRouter } from 'next/navigation';
import Spinner from '@/svg/spinner';
import { setCookie } from 'cookies-next';
import EyeIcon from '@/svg/eye';
import EyeOffIcon from '@/svg/eyeOff';

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>({});
  const [invalidCredentials, setInvalidCredentials] = useState<string>('');
  const [isRemembered, setIsRemembered] = useState<boolean>(false);
  const [credentials, setCredentials] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCredentials = getRememberMeData('credentials');
    if (savedCredentials) {
      setCredentials(savedCredentials);
      setIsRemembered(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsRemembered(isChecked);

    if (isChecked) {
      rememberMe('credentials', credentials);
    } else {
      removeFromLocalStorage('credentials');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});
    setInvalidCredentials('');
    try {
      setLoading(true);
      const response = await apiClient.post('/login', credentials);
      if (response.status === 200) {
        if (isRemembered) {
          rememberMe('credentials', credentials);
        }
        setCookie('token', response.data.token);
        router.push('/');
      } else if (response.error) {
        setInvalidCredentials(response.error);
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
      <div className="flex flex-wrap items-center min-h-screen">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="px-26 py-17.5 text-center">
            <Link className="mb-5.5 inline-block" href="/">
              <Image
                className="hidden dark:block"
                src={'/images/logo/logo.svg'}
                alt="Logo"
                width={176}
                height={32}
              />
              <Image
                className="dark:hidden"
                src={'/images/logo/logo-dark.svg'}
                alt="Logo"
                width={176}
                height={32}
              />
            </Link>

            <p className="2xl:px-20">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
              suspendisse.
            </p>

            <span className="mt-15 inline-block">
              <Image
                src={'/images/logo/myloggi.png'}
                alt="Logo"
                width={250}
                height={50}
              />
            </span>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="text-center text-3xl font-extrabold">
              Sign in to your account
            </h2>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 shadow-sm -space-y-px">
                <div>
                  <label htmlFor="usernameOrEmail" className="sr-only">
                    Username or Email
                  </label>
                  <input
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    required
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Username or Email"
                    value={credentials.usernameOrEmail} // Updated field name
                    onChange={handleChange}
                  />
                </div>
                {error && error.usernameOrEmail && (
                  <p className="mt-2 text-sm text-red">
                    {error.usernameOrEmail}
                  </p>
                )}
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-4"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>

                {error && error.password && (
                  <p className="mt-2 text-sm text-red">{error.password}</p>
                )}

                {invalidCredentials && (
                  <p className="mt-2 text-sm text-red">{invalidCredentials}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={isRemembered}
                    onChange={handleRememberMe}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/auth/forget-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
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
                    'Sign in'
                  )}
                </button>
                <div className="mt-6 text-center">
                  <p>
                    don't have an account?{' '}
                    <Link href="/auth/signup" className="text-primary">
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
