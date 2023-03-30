import { Box, Flex, Icon, Spacer, Text, Image, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { RxDashboard } from 'react-icons/rx';
import { FaPeopleArrows, FaPeopleCarry, FaPhotoVideo, FaUsers } from 'react-icons/fa';
import { IoPeople, IoPeopleCircle, IoPeopleSharp, IoSettingsOutline } from 'react-icons/io5';
import { FiLogOut, FiPower } from 'react-icons/fi';
import { ReactNode } from 'react';
import { useAuth } from 'reactfire';
import signout from '@/utils/signout';
import { Jua } from '@next/font/google';

const pages = [
  {
    name: 'Home',
    icon: RxDashboard
  },
  {
    name: 'Users',
    icon: FaUsers
  },
  {
    name: 'Posts',
    icon: FaPhotoVideo
  },
  {
    name: 'Admins',
    icon: IoSettingsOutline
  }
];

const jua = Jua({
  weight: '400',
  preload: false,
  subsets: ['latin']
});

const Navbar = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const toast = useToast();
  const auth = useAuth();

  return (
    <>
      <Flex
        direction="column"
        position="fixed"
        h="100vh"
        w="240px"
        bgColor="accent_white"
        borderRight="1px"
        borderRightColor="gray.300">
        <Flex h="20" alignItems="center" mx="4" justifyContent="space-between">
          <Flex
            h={'calc(100% - 20px)'}
            w={'100%'}
            bg={'accent_yellow'}
            alignItems="center"
            rounded={'10px'}>
            <Image src={'/logo.png'} alt="logo" h={'50px'} w={'50px'} rounded={'10px'} />
            <Flex direction={'column'}>
              <Text fontFamily={jua.style.fontFamily} ml="2" fontSize="xl" color={'accent_blue'}>
                ScrapReal
              </Text>
              <Text ml="2" fontSize="xs" color="accent_purple">
                Platform Manager
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {pages.map((page) => (
          <Flex
            key={page.name}
            alignItems="center"
            p="4"
            mx="4"
            borderRadius="lg"
            cursor="pointer"
            fontSize="20px"
            _hover={{ bgColor: 'accent_blue', color: 'accent_white' }}
            onClick={() => router.push(`/${page.name.toLowerCase()}`)}>
            <Icon mr="4" fontSize={25} as={page.icon} />
            {page.name}
          </Flex>
        ))}
        <Spacer />
        <Flex
          alignItems="center"
          p="4"
          m="4"
          color="accent_red"
          borderRadius="lg"
          cursor="pointer"
          fontSize="20px"
          _hover={{ bgColor: 'accent_red', color: 'accent_white' }}
          onClick={() => {
            signout({ auth, router, toast });
          }}>
          <Icon mr="4" fontSize={25} as={FiLogOut} />
          Sign Out
        </Flex>
      </Flex>
      <Box
        position="fixed"
        h="100vh"
        w="calc(100vw - 240px)"
        ml="240px"
        p="16px"
        bgColor="gray.100"
        overflow="auto">
        {children}
      </Box>
    </>
  );
};

export default Navbar;
