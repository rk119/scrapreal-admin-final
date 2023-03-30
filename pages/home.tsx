/* eslint-disable prettier/prettier */
/*/* eslint-disable prettier/prettier */

import { Box, Flex, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, useToast, VStack } from '@chakra-ui/react';
import { collection, query, QuerySnapshot } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import 'firebase/database';
import React, { useState } from 'react';
import Link from 'next/link';

const Home = () => {
  const [users, setUsers] = useState(-1);
  const toast = useToast();
  const db = useFirestore();
  const users_collection = collection(db, 'users');
  const scrapbook_collection = collection(db, 'scrapbooks');
  const users_query = query(users_collection);
  const scrapbook_query = query(scrapbook_collection);
  const { data: scrapbookData } = useFirestoreCollectionData(scrapbook_query);
  const { status, data: usersData } = useFirestoreCollectionData(users_query);

  const getUserData = (id: string) => {
    const user = usersData?.find((user) => user.uid === id);
    return user;
  };
  const getScrapbookData = (id: string) => {
    const scrapbook = scrapbookData?.find((scrapbook) => scrapbook.scrapbookId === id);
    return scrapbook;
  };

  return (
    <div>
      <VStack spacing={8} align="stretch">
        <Box borderRadius="25px" backgroundColor="#322659" w="1529" h="260">
          <Heading color={'white'} paddingLeft={'30px'} paddingTop={'20px'}>
            Statistics
          </Heading>
          <Flex justify={'center'}>
            <Box
              bgColor={'#F2EEEE'}
              width={'40%'}
              padding="10px"
              paddingBottom="20px"
              margin={'10'}
              fontSize="3xl"
              fontStyle={'bold'}
              borderRadius="2xl">
              Total number of users
              <Table variant="unstyled">
                <Tr>
                  <Th textColor="black" fontSize="30px" textAlign="center" fontStyle={'normal'}>
                    {usersData?.length}
                  </Th>
                </Tr>
              </Table>
            </Box>

            <Box
              bgColor={'#AAA7FB'}
              width={'40%'}
              padding="10px"
              paddingBottom="20px"
              margin={'10'}
              fontSize="3xl"
              fontStyle={'bold'}
              borderRadius="2xl">
              Total number of Scrapbooks
              <Table variant="unstyled">
                <Tr>
                  <Th color="white" fontSize="30px" textAlign="center" fontStyle={'normal'}>
                    {scrapbookData?.length}
                  </Th>
                </Tr>
              </Table>
            </Box>
          </Flex>
        </Box>
        
        <HStack alignItems="flex-start" justifyContent="center">
          <Table backgroundColor={'#021c3d'} width={'40%'} borderRadius={'25px'}>
            <Thead>
              <Tr>
                <Th color="white" fontSize="40px" padding="30px">
                  Username
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {usersData?.map((usersMap) => (
                <Tr key={usersMap.id}>
                  <Td
                    color="white"
                    _hover={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      color: '#9AE6B4'
                    }}>
                    <Link
                      href={{
                        pathname: '/user',
                        query: { userUid: usersMap.uid }
                      }}>
                      @{getUserData(usersMap.uid)?.username}
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Box
              padding={'5'}></Box>


          <Table backgroundColor={'#021c3d'} width={'40%'} borderRadius={'25px'}>
            <Thead>
              <Tr>
                <Th color="white" fontSize="40px" padding="30px">
                  Scrapbooks
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {scrapbookData?.map((usersMap) => (
                <Tr key={usersMap.id}>
                  <Td
                    color="white"
                    _hover={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      color: '#9AE6B4'
                    }}>
                    <Link
                      href={{
                        pathname: '/scrapbook',
                        query: { scrapbookId: usersMap.scrapbookId }
                      }}>
                      {getScrapbookData(usersMap.scrapbookId)?.title}
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </HStack>
      </VStack>
    </div>
  );
};
export default Home;


{/* import { Box, Flex, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, useToast, VStack } from '@chakra-ui/react';
import { collection, query, QuerySnapshot } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import 'firebase/database';
import React, { useState } from 'react';
import Link from 'next/link';

const Home = () => {
  const [users, setUsers] = useState(-1);
  const toast = useToast();
  const db = useFirestore();
  const users_collection = collection(db, 'users');
  const scrapbook_collection = collection(db, 'scrapbooks');
  const users_query = query(users_collection);
  const scrapbook_query = query(scrapbook_collection);
  const { data: scrapbookData } = useFirestoreCollectionData(scrapbook_query);
  const { status, data: usersData } = useFirestoreCollectionData(users_query);

  const getUserData = (id: string) => {
    const user = usersData?.find((user) => user.uid === id);
    return user;
  };
  const getScrapbookData = (id: string) => {
    const scrapbook = scrapbookData?.find((scrapbook) => scrapbook.scrapbookId === id);
    return scrapbook;
  };

  return (
    <div>
      <VStack spacing={8} align="stretch">
      <Box borderRadius="25px" backgroundColor="#322659" w="1529" h="260">
        <Heading color={'white'} paddingLeft={'30px'} paddingTop={'20px'}>
          Statistics
        </Heading>
        <Flex justify={'center'}>
          <Box
            bgColor={'#F2EEEE'}
            width={'30%'}
            margin={'10'}
            fontSize="2xl"
            fontStyle={'italic'}
            borderRadius="2xl">
            Total number of users
            <Table variant="unstyled">
              <Tr>
                <Th textColor="black" fontSize="30px" textAlign="center" fontStyle={'normal'}>
                  {usersData?.length}
                </Th>
              </Tr>
            </Table>
          </Box>

          <Box
            bgColor={'#AAA7FB'}
            width={'30%'}
            margin={'10'}
            fontSize="2xl"
            fontStyle={'italic'}
            borderRadius="2xl">
            Total number of posts
            <Table variant="unstyled">
              <Tr>
                <Th color="white" fontSize="30px" textAlign="center" fontStyle={'normal'}>
                  {scrapbookData?.length}
                </Th>
              </Tr>
            </Table>
          </Box>
        </Flex>
      </Box>
      <Box borderRadius="25px" w="1529" h="5" margin={5}>
      </Box>
      <HStack>
          
              <Table variant="unstyled" size="lg" width="md" paddingTop={'80px'}>
                <Box
                  borderWidth="3px"
                  borderRadius="25px"
                  backgroundColor="#021c3d"
                  position={'relative'}
                  top="-189px">
                  <Thead>
                    <Tr blockSize="70px">
                      <Th color="white" fontSize="40px">
                        Users
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {usersData?.map((usersMap) => (
                      <Tr key={usersMap.id}>
                        <Td
                          color="white"
                          _hover={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            color: '#9AE6B4'
                          }}>
                          <Link
                            href={{
                              pathname: '/user',
                              query: { userUid: usersMap.uid }
                            }}>
                            @{getUserData(usersMap.uid)?.username}
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Box>
              </Table>
              <Table variant="unstyled" size="lg" width="md">
                <Box borderWidth="3px" borderRadius="25px" backgroundColor="#021c3d">
                  <Thead>
                    <Tr blockSize="70px">
                      <Th color="white" fontSize="40px">
                        Posts
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {scrapbookData?.map((usersMap) => (
                      <Tr key={usersMap.id}>
                        <Td color="white">
                          <Link
                            href={{
                              pathname: '/scrapbook',
                              query: { scrapbookId: usersMap.scrapbookId }
                            }}>
                            {getScrapbookData(usersMap.scrapbookId)?.title}
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Box>
          </Table>
        </HStack>
        </VStack>
    </div>
  );
};
export default Home; */}

