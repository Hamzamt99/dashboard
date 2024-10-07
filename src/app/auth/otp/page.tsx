'use client';
import React, { useState } from 'react';
import { apiClient } from '@/customApi/auth.api';
import { useRouter } from 'next/navigation';
import Spinner from '@/svg/spinner';

const OTP: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const otpValue = otp.join('');

    const email = localStorage.getItem('email');
    try {
      setLoading(true);
      const response = await apiClient.post('/check-otp', {
        otp: otpValue,
        email,
      });
      if (response.status === 200) {
        router.push('/success');
      } else {
        setError(response);
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
        <div className="w-1/3">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="text-center text-3xl font-extrabold">OTP</h2>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    className="w-12 h-12 rounded-lg border border-graydark bg-transparent text-center text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="-"
                  />
                ))}
              </div>
              <div className="flex justify-center items-center">
                {error && <p className="mt-2 text-md text-red">{error}</p>}
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
                    'Verify OTP'
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

export default OTP;
