'use client';
import React, { useState } from 'react';
import { useUser } from '@/context/user.context';

import logo from '../../assets/icons/logo.png';

const Otp: React.FC = () => {
  const { verifyOtp, otpErrors, loading } = useUser();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;

    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value === '') {
      if (element.previousSibling) {
        (element.previousSibling as HTMLInputElement).focus();
      }
    } else {
      if (element.nextSibling) {
        (element.nextSibling as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    verifyOtp(enteredOtp);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center justify-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-1/2" src={logo.src} alt="logo" />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Enter the code that was sent to your email
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="flex justify-center space-x-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    name="otp"
                    maxLength={1}
                    className="w-12 h-12 text-center bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
              </div>
              {otpErrors?.otp && (
                <p className="text-red-500">{otpErrors.otp}</p>
              )}
              <button
                type="submit"
                className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Otp;
