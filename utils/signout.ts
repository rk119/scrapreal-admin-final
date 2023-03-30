import { ErrorToast, SuccessToast } from '@/components/toast-component';
import { deleteCookie } from 'cookies-next';
import { signOut } from 'firebase/auth';

export default function Signout({ auth, router, toast }: any) {
  signOut(auth)
    .then(() => {
      deleteCookie('user');
      router.push('/signin');
      SuccessToast({ message: 'Signed out successfully', toast });
    })
    .catch((error) => {
      ErrorToast({ message: error.message, toast });
    });
}
