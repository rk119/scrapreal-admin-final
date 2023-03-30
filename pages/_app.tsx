import { app, auth, db, storage } from '../firebase-config';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { FirebaseAppProvider, AuthProvider, FirestoreProvider, StorageProvider } from 'reactfire';
import { theme } from '@/styles/global';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const Navbar = dynamic(() => import('@/components/navbar'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <FirebaseAppProvider firebaseApp={app}>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={db}>
          <StorageProvider sdk={storage}>
          <ChakraProvider theme={theme}>
            {router.pathname !== '/signin' ? (
              <Navbar>
                <Component {...pageProps} />
              </Navbar>
            ) : (
              <Component {...pageProps} />
            )}
            </ChakraProvider>
          </StorageProvider>
        </FirestoreProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  );
}
