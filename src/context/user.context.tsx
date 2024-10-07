'use client';
import { createContext, useState, ReactNode, useContext } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { requestBuilder } from '@/api/requestBuilder';

import { requestNotificationPermission } from '@/firebase/firebaseConfig';

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginErrors {
  email?: string[];
  password?: string[];
}

interface SignupErrors {
  email?: string[];
  password?: string[];
  username?: string[];
  name?: string[];
  phone?: string[];
}

interface OtpErrors {
  otp?: string;
}

interface UserContextType {
  userData: User | null;
  setUserData: (user: User | null) => void;
  token: string;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    username: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  loading: boolean;
  loginErrors: LoginErrors | null;
  signupErrors: SignupErrors | null;
  otpErrors: OtpErrors | null;
  setSignupErrors: React.Dispatch<React.SetStateAction<SignupErrors | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loginErrors, setLoginErrors] = useState<LoginErrors | null>(null);
  const [signupErrors, setSignupErrors] = useState<SignupErrors | null>(null);
  const [token, setToken] = useState<string>('');
  const [otpErrors, setOtpErrors] = useState<OtpErrors | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const login = async (usernameOrEmail: string, password: string) => {
    setLoading(true);
    setLoginErrors(null);
    try {
      const fcmToken = await requestNotificationPermission();
      const response = await requestBuilder.post('/login', {
        usernameOrEmail,
        password,
        fcmToken,
      });

      const { token, user } = response.data;

      setToken(token);

      Cookies.set('token', token, { secure: true, sameSite: 'strict' });
      setUserData(user);

      router.push('/');
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      setLoginErrors(errors || error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    full_name: string,
    username: string,
    email: string,
    phone: string,
    password: string
  ) => {
    setLoading(true);
    setSignupErrors(null);
    try {
      const response = await requestBuilder.post('/signup', {
        full_name,
        username,
        email,
        phone,
        password,
      });

      if (response.status === 200) {
        Cookies.set('token', response.data.token, {
          secure: true,
          sameSite: 'strict',
        });
        router.push('/auth/otp');
      }
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      setSignupErrors(errors || error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    setLoading(true);
    setOtpErrors(null);

    if (otp.length !== 6) {
      setOtpErrors({ otp: 'Please enter a valid 6-digit OTP' });
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get('token');
      const response = await requestBuilder.post(
        '/verify-account',
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Cookies.remove('token');
        router.push('/auth/signin');
      } else {
        setOtpErrors({ otp: 'Invalid OTP. Please try again.' });
      }
    } catch (error: any) {
      setOtpErrors({
        otp: error.response?.data.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        login,
        signup,
        verifyOtp,
        loading,
        loginErrors,
        signupErrors,
        otpErrors,
        setSignupErrors,
        token,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
