'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition duration-200 flex">
      <svg width="10" height="10" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className='mt-1 mr-1'>
  <path
    d="M26.495 1.12392C27.3658 1.13476 28.1071 1.45382 28.7189 2.0811C29.3308 2.70837 29.6318 3.45793 29.622 4.32976L29.3461 26.4947C29.3352 27.3655 29.0156 28.1068 28.3873 28.7186C27.759 29.3305 27.0099 29.6315 26.1402 29.6217L15.0577 29.4837L15.0972 26.3173L26.1796 26.4553L26.4556 4.29034L15.3731 4.15237L15.4125 0.985947L26.495 1.12392ZM9.00085 7.23995L11.1492 9.5627L7.06174 13.5496L20.0045 13.7108L19.9651 16.8772L7.02232 16.7161L11.0092 20.8035L8.80374 23.0721L0.986243 15.0574L9.00085 7.23995Z"
    fill="black"
  />
</svg>

    Logout
    </button>
  );
}
