'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminSvg from '@/svg/admin';
import { apiClient } from '@/customApi/auth.api';
import PersonSvg from '@/svg/person';
import Mail from '@/svg/mail';
import Eye from '@/svg/eye';
import EyeOff from '@/svg/eyeOff';
import Spinner from '@/svg/spinner';
import { useRouter } from 'next/navigation';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (
      formData.password !==
      (
        document.querySelector(
          'input[name="retype_password"]'
        ) as HTMLInputElement
      ).value
    ) {
      setErrors({ retype_password: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/signup', formData);
      if (response.status === 201) {
        router.push('/auth/otp');
      } else if (response.errors) {
        const errorObj: any = {};
        response.errors.forEach((error: any) => {
          errorObj[error.path] = error.msg;
        });
        setErrors(errorObj);
      } else {
        setErrors('Something went wrong please try again later');
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
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
              <AdminSvg />
            </span>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign Up to MyLoggi
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span className="absolute right-4 top-4">
                    <PersonSvg />
                  </span>
                </div>
                {errors.username && (
                  <p className="text-red text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span className="absolute right-4 top-4">
                    <PersonSvg />
                  </span>
                </div>
                {errors.full_name && (
                  <p className="text-red text-sm mt-1">{errors.full_name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span className="absolute right-4 top-4">
                    <Mail />
                  </span>
                </div>
                {errors.email && (
                  <p className="text-red text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span className="absolute right-4 top-4">
                    <PersonSvg />
                  </span>
                </div>
                {errors.phone && (
                  <p className="text-red text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span
                    className="absolute right-4 top-4 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Re-type Password
                </label>
                <div className="relative">
                  <input
                    type={showRetypePassword ? 'text' : 'password'}
                    name="retype_password"
                    placeholder="Re-enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span
                    className="absolute right-4 top-4 cursor-pointer"
                    onClick={() => setShowRetypePassword(!showRetypePassword)}
                  >
                    {showRetypePassword ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </span>
                </div>
                {errors.retype_password && (
                  <p className="text-red text-sm mt-1">
                    {errors.retype_password}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner className="w-6 h-6 animate-spin" />
                  ) : (
                    'Create account'
                  )}
                </button>
              </div>
              {errors.general && (
                <p className="text-red text-sm mt-4 text-center">
                  {errors.general}
                </p>
              )}
              <div className="mt-6 text-center">
                <p>
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-primary">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
