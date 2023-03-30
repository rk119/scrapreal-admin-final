import { ErrorToast, SuccessToast } from '@/components/toast-component';
import { InputField, WebButton } from '@/styles/global';
import ParseError from '@/utils/parse-error';
import {
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Text,
  useToast
} from '@chakra-ui/react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query } from 'firebase/firestore';
import { FormEvent, useState } from 'react';
import { useAuth, useFirestore, useFirestoreCollectionData } from 'reactfire';
import { useRouter } from 'next/router';
import { Jua } from '@next/font/google';
import { setCookie } from 'cookies-next';

const ids: string[] = [];

const jua = Jua({
  weight: '400',
  preload: false,
  subsets: ['latin']
});

const Signin = () => {
  const toast = useToast();
  const router = useRouter();

  const auth = useAuth();
  const db = useFirestore();
  const admin_collection = collection(db, 'admin');
  const admin_query = query(admin_collection);
  const { data } = useFirestoreCollectionData(admin_query);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        ids.length = 0;
        data?.map((item) => {
          ids.push(item.uid);
        });
        if (ids.includes(userCredential.user?.uid)) {
          setCookie('user', 'true');
          setTimeout(() => {
            router.push('/home');
          }, 2e3);
          SuccessToast({ message: 'Welcome back!', toast });
        } else {
          setLoading(false);
          signOut(auth);
          ErrorToast({ error: 'You are not an admin!', toast });
        }
      })
      .catch((error) => {
        setLoading(false);
        ErrorToast({
          error: ParseError(error),
          toast
        });
      });
  };

  return (
    <>
      <form onSubmit={signin}>
        <Center h="100vh">
          <Flex
            bgColor="accent_white_dark"
            direction="column"
            alignItems="center"
            gap={2}
            p={8}
            rounded="10px"
            shadow="xl">
            <Image src="/logo.png" alt="logo" width={150} height={150} />
            <Heading fontFamily={jua.style.fontFamily}>ScrapReal</Heading>
            <Text mb="2" fontSize="xs" color="accent_purple">
              Platform Manager
            </Text>
            <FormControl id="email">
              <FormLabel>Email:</FormLabel>
              <InputField
                onChange={(e: any) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                required
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password:</FormLabel>
              <InputField
                onChange={(e: any) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
              />
            </FormControl>
            <WebButton isLoading={loading} mt="20px" type="submit">
              Login
            </WebButton>
          </Flex>
        </Center>
      </form>
    </>
  );
};

export default Signin;
