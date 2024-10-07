import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ClickOutside from '@/components/ClickOutside';
import ProfileSvg from '@/svg/Profile';
import ContentSvg from '@/svg/content';
import Setting from '@/svg/setting';
import Logout from '@/svg/logout';
import ArrowDown from '@/svg/arrow-down';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const logoutHandler = () => {
    const isConfirmed = window.confirm('Are you sure you want to logout?');

    if (isConfirmed) {
      deleteCookie('token');
      router.push('/auth/signin');
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            Thomas Anree
          </span>
          <span className="block text-xs">UX Designer</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={'/images/user/user-01.png'}
            style={{
              width: 'auto',
              height: 'auto',
            }}
            alt="User"
          />
        </span>

        <ArrowDown />
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <ProfileSvg />
                My Profile
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <ContentSvg />
                My Contacts
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <Setting />
                Account Settings
              </Link>
            </li>
          </ul>
          <button
            onClick={logoutHandler}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <Logout />
            Log Out
          </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
