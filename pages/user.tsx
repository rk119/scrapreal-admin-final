import { collection, query, deleteDoc, doc, updateDoc,  } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { deleteUser } from 'firebase/auth';
import { useAuth, useFirestoreCollectionData, useStorage, useFirestore, useFirebaseApp} from 'reactfire';
import router, { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import { Poppins } from '@next/font/google';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Heading,
    TableContainer,
    Box,
    Spacer,
    Stack,
    VStack,
    HStack,
    Image,
    Flex,
    useToast,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    } from '@chakra-ui/react';
import { Key, useState } from 'react';
import { ArrowBackIcon, ArrowLeftIcon, DeleteIcon, WarningIcon } from '@chakra-ui/icons';
import { ErrorToast, SuccessToast } from '@/components/toast-component';
import Link from 'next/link';

const User = (userUid: string) => {
    const toast = useToast();
    const db = useFirestore();
    const storage = useStorage();
    const users_collection = collection(db, 'users');
    const scrapbook_collection = collection(db, 'scrapbooks');
    const users_query = query(users_collection);
    const scrapbook_query = query(scrapbook_collection);
    const { data: usersData } = useFirestoreCollectionData(users_query);
    const { data: scrapbookData } = useFirestoreCollectionData(scrapbook_query);
    const user = router.query.userUid as string;
    const [isSuspensionModalOpen, setIsSuspensionModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const getUserData = (id: string) => {
        const user = usersData?.find((user) => user.uid === id);
        return user;
    };

    const getScrapbookData = (id: string) => {
        const scrapbook = scrapbookData?.find((scrapbook) => scrapbook.scrapbookId == id);
        return scrapbook;
    };

    const handleBack = () => {
        router.back();
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'users', id));
            await deleteDoc(doc(db, 'reportedUsers', id));
            const photoUrl = await getUserData(id)?.photoUrl;
            
            if (photoUrl != "") {
                await deleteObject(ref(storage, `${photoUrl}`));
            }
          
            SuccessToast({ message: 'Deleted', toast });
            router.push('/users');
        } catch (error : any) {
            ErrorToast({ error: error.message, toast });
            router.push('/users');
        }
    };

    const handleSuspension = async (id: string) => {
        try {
            await updateDoc(doc(db, 'users', id), {
                isSuspended: true,
                dateOfSuspension: new Date(),
            });
          
            SuccessToast({ message: 'Suspended', toast });
        } catch (error : any) {
            ErrorToast({ error: error.message, toast });
            router.push('/users');
        }
    };

    const handleSuspendUser = () => {
        handleSuspension(user);
        setIsSuspensionModalOpen(false);
    };

    const handleDeleteUser = () => {
        handleDelete(user);
        setIsDeleteModalOpen(false);
    };

    const userScrapbooksIds = scrapbookData?.filter((scrapbook) => scrapbook.creatorUid === user);
    const userScrapbooks = userScrapbooksIds?.map((scrapbook) => getScrapbookData(scrapbook.scrapbookId));
    const reportedScrapbooks = getUserData(user)?.reportedPosts?.map((reportedScrapbook: any) => getScrapbookData(reportedScrapbook));
    const collaboratedScrapbooks = scrapbookData?.filter((scrapbook) => getScrapbookData(scrapbook.scrapbookId)?.collaborators[getUserData(user)?.username]);
    const savedPosts = getUserData(user)?.savedPosts?.map((savedPost: any) => getScrapbookData(savedPost));
    const reportedUsers = getUserData(user)?.reportedUsers?.map((reportedUser: any) => getUserData(reportedUser));

    return (
        <div>
            <Flex>
                <IconButton
                    aria-label="Back"
                    colorScheme={'blue'}
                    icon={<ArrowLeftIcon />}
                    onClick={() => handleBack()}
                />
                <Heading ml={4} size="xl">User Profile</Heading>
                <Spacer />
                <Button colorScheme='yellow' onClick={() => setIsSuspensionModalOpen(true)}>Suspend</Button>
                <Box ml={2} />
                <IconButton
                    aria-label="Delete"
                    colorScheme={'red'}
                    icon={<DeleteIcon />}
                    onClick={() => setIsDeleteModalOpen(true)}
                />
            </Flex>
            <Modal isOpen={isSuspensionModalOpen} onClose={() => setIsSuspensionModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Suspend User</ModalHeader>
                    <ModalBody>
                        Are you sure you want to suspend {getUserData(user)?.name}?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={() => setIsSuspensionModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button colorScheme='yellow' onClick={handleSuspendUser}>
                            Suspend
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete User</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete {getUserData(user)?.name}?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={handleDeleteUser}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <VStack spacing={'10'}>
                <HStack spacing='20'>
                    <VStack>
                        <Heading size='lg'>Profile Photo</Heading>
                        <Image
                            fit='cover'
                            borderRadius='full'
                            boxSize='150px'
                            src={getUserData(user)?.photoUrl != "" ? getUserData(user)?.photoUrl : '/profile.png'}
                            alt='Profile Photo'
                        />
                    </VStack>
                    <Box boxShadow={'lg'} p={6} rounded={'md'} w='400px' height='200px' bgColor='#F7FAFC'>
                        <VStack align={'flex-start'} spacing={'6'}>
                            <HStack>
                                <Heading size='md'>Name: </Heading>
                                <Box style={{ wordWrap: 'break-word' }} color='gray.600'>{getUserData(user)?.name}</Box>
                            </HStack>
                            <HStack>
                                <Heading size='md'>Username: </Heading>
                                <Box style={{ wordWrap: 'break-word' }} color='gray.600'>@{getUserData(user)?.username}</Box>
                            </HStack>
                            <HStack>
                                <Heading size='md'>Bio: </Heading>
                                <Box style={{ wordWrap: 'break-word' }} color='gray.600'>{getUserData(user)?.bio}</Box>
                            </HStack>
                        </VStack>
                    </Box>
                </HStack>
                <HStack spacing={10} alignItems='flex-start'>
                    <VStack spacing={6}>
                        <Heading as='h2' size='xl'>Followers</Heading>
                        <Box borderWidth='3px'>
                            <Table variant="simple" size='lg'>
                                <Thead>
                                    <Tr>
                                        <Th>Username</Th>
                                        <Th>Name</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {getUserData(user)?.followers.map((follower: any) => (
                                        getUserData(follower)?.username !== undefined ?
                                        <Tr key={follower}>
                                            <Td _hover={
                                                {
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    color: 'blue.500',
                                                }
                                            }>  
                                                <Link href={{
                                                    pathname: '/user',
                                                    query: { userUid: getUserData(follower)?.uid },
                                                }}>
                                                @{getUserData(follower)?.username}
                                                </Link>
                                            </Td>
                                            <Td>{getUserData(follower)?.name}</Td>
                                        </Tr> : null
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </VStack>
                    <VStack spacing={6}>
                        <Heading as='h2' size='xl'>Following</Heading>
                        <Box borderWidth='3px'>
                            <Table variant="simple" size='lg'>
                                <Thead>
                                    <Tr>
                                        <Th>Username</Th>
                                        <Th>Name</Th>
                                    </Tr>
                                </Thead>    
                                <Tbody>
                                    {getUserData(user)?.following.map((following: any) => (
                                        getUserData(following)?.username !== undefined ? 
                                        <Tr key={following}>
                                            <Td _hover={
                                                {
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    color: 'blue.500',
                                                }
                                            }>  
                                                <Link href={{
                                                    pathname: '/user',
                                                    query: { userUid: getUserData(following)?.uid },
                                                }}>
                                                @{getUserData(following)?.username}
                                                </Link>
                                            </Td>
                                            <Td>{getUserData(following)?.name}</Td>
                                        </Tr> : null
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </VStack>
                    <VStack spacing={6}>
                        <Heading as='h2' size='xl'>Blocked</Heading>
                        <Box borderWidth='3px'>
                            <Table variant="simple" size='lg'>
                                <Thead>
                                    <Tr>
                                        <Th>Username</Th>
                                        <Th>Name</Th>
                                    </Tr>
                                </Thead>    
                                <Tbody>
                                    {getUserData(user)?.blockedUsers.map((blocked: any) => (
                                        getUserData(blocked)?.username !== undefined ?
                                        <Tr key={blocked}>
                                            <Td _hover={
                                                {
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    color: 'blue.500',
                                                }
                                            }>  
                                                <Link href={{
                                                    pathname: '/user',
                                                    query: { userUid: getUserData(blocked)?.uid },
                                                }}>
                                                @{getUserData(blocked)?.username}
                                                </Link>
                                            </Td>
                                            <Td>{getUserData(blocked)?.name}</Td>
                                        </Tr> : null
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </VStack>
                    <VStack spacing={6}>
                        <Heading as='h2' size='xl'>Reported Users</Heading>
                        <Box borderWidth='3px'>
                            <Table variant="simple" size='lg'>
                                <Thead>
                                    <Tr>
                                        <Th>Username</Th>
                                        <Th>Name</Th>
                                    </Tr>
                                </Thead>    
                                <Tbody>
                                    {reportedUsers?.map((reported: any) => (
                                        getUserData(reported)?.username !== undefined ?
                                        <Tr key={reported}>
                                            <Td _hover={
                                                {
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    color: 'blue.500',
                                                }
                                            }>  
                                                <Link href={{
                                                    pathname: '/user',
                                                    query: { userUid: getUserData(reported)?.uid },
                                                }}>
                                                @{getUserData(reported)?.username}
                                                </Link>
                                            </Td>
                                            <Td>{getUserData(reported)?.name}</Td>
                                        </Tr> : null
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </VStack>
                </HStack>
                <HStack spacing={10} alignItems='flex-start'>
                    <VStack spacing={6}>
                        <Heading as='h2' size='xl'>Scrapbooks</Heading>
                        <Box borderWidth='3px'>
                            <Table variant="simple" size='lg'>
                                <Thead>
                                    <Tr>
                                        <Th>Title</Th>
                                        <Th>Visibility</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {userScrapbooks?.map((scrapbook) => (
                                        getScrapbookData(scrapbook?.scrapbookId)?.title !== undefined ?
                                        <Tr key={scrapbook?.id}>
                                            <Td _hover={
                                                {
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    color: 'blue.500',
                                                }
                                            }>
                                                <Link href={{
                                                    pathname: '/scrapbook',
                                                    query: { scrapbookId: scrapbook?.scrapbookId },
                                                }}>
                                                    {getScrapbookData(scrapbook?.scrapbookId)?.title}
                                                </Link>
                                            </Td>
                                            <Td>{scrapbook?.visibility}</Td>
                                        </Tr> : null
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </VStack>
                    <VStack spacing={6}>
                        <Heading as='h2' size='xl'>Collaborated</Heading>
                        <Box borderWidth='3px'>
                            <Table variant="simple" size='lg'>
                                <Thead>
                                    <Tr>
                                        <Th>Title</Th>
                                        <Th>Visibility</Th>
                                    </Tr>
                                </Thead>    
                                <Tbody>
                                    {collaboratedScrapbooks?.map((scrapbook: any) => (
                                        getScrapbookData(scrapbook?.scrapbookId)?.title !== undefined ?
                                        <Tr key={scrapbook?.id}>
                                            <Td _hover={
                                                {
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    color: 'blue.500',
                                                }
                                            }>
                                                <Link href={{
                                                    pathname: '/scrapbook',
                                                    query: { scrapbookId: scrapbook?.scrapbookId },
                                                }}>
                                                    {getScrapbookData(scrapbook?.scrapbookId)?.title}
                                                </Link>
                                            </Td>
                                            <Td>{scrapbook?.visibility}</Td>
                                        </Tr> : null
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </VStack>
                    <VStack spacing={6}>
                        <Heading as='h2' size='xl'>Reported Posts</Heading>
                        <Box borderWidth='3px'>
                            <Table variant="simple" size='lg'>
                                <Thead>
                                    <Tr>
                                        <Th>Title</Th>
                                        <Th>Visibility</Th>
                                    </Tr>
                                </Thead>    
                                <Tbody>
                                    {reportedScrapbooks?.map((scrapbook: any) => (
                                        getScrapbookData(scrapbook?.scrapbookId)?.title !== undefined ?
                                        <Tr key={scrapbook?.id}>
                                            <Td _hover={
                                                {
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    color: 'blue.500',
                                                }
                                            }>
                                                <Link href={{
                                                    pathname: '/scrapbook',
                                                    query: { scrapbookId: scrapbook?.scrapbookId },
                                                }}>
                                                    {getScrapbookData(scrapbook?.scrapbookId)?.title}
                                                </Link>
                                            </Td>
                                            <Td>{scrapbook?.visibility}</Td>
                                        </Tr> : null
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </VStack>
                    <VStack spacing={6}>
                        <Heading as='h2' size='xl'>Saved</Heading>
                        <Box borderWidth='3px'>
                            <Table variant="simple" size='lg'>
                                <Thead>
                                    <Tr>
                                        <Th>Title</Th>
                                        <Th>Visibility</Th>
                                    </Tr>
                                </Thead>    
                                <Tbody>
                                    {savedPosts?.map((scrapbook: any) => (
                                        getScrapbookData(scrapbook?.scrapbookId)?.title !== undefined ?
                                        <Tr key={scrapbook?.id}>
                                            <Td _hover={
                                                {
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    color: 'blue.500',
                                                }
                                            }>
                                                <Link href={{
                                                    pathname: '/scrapbook',
                                                    query: { scrapbookId: scrapbook?.scrapbookId },
                                                }}>
                                                    {getScrapbookData(scrapbook?.scrapbookId)?.title}
                                                </Link>
                                            </Td>
                                            <Td>{scrapbook?.visibility}</Td>
                                        </Tr> : null
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </VStack>
                </HStack>
            </VStack>
        </div>
    );
 }

export default User;