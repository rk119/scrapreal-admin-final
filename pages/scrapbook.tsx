import { collection, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
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
    Box,
    Spacer,
    Stack,
    VStack,
    HStack,
    Image,
    Flex,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@chakra-ui/react';
import { Key, useState } from 'react';
import { ArrowBackIcon, ArrowLeftIcon, DeleteIcon } from '@chakra-ui/icons';
import { ErrorToast, SuccessToast } from '@/components/toast-component';
import Link from 'next/link';

const Scrapbook = (scrapbookId: string) => {
    const toast = useToast();
    const db = useFirestore();
    const storage = useStorage();
    const scrapbook_collection = collection(db, 'scrapbooks');
    const users_collection = collection(db, 'users');
    const scrapbook_query = query(scrapbook_collection);
    const users_query = query(users_collection);
    const { data: scrapbookData } = useFirestoreCollectionData(scrapbook_query);
    const { data: usersData } = useFirestoreCollectionData(users_query);
    const scrap = router.query.scrapbookId as string;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const getScrapbookData = (id: string) => {
        const scrapbook = scrapbookData?.find((scrapbook) => scrapbook.scrapbookId == id);
        return scrapbook;
    };

    const getUserData = (id: string) => {
        const user = usersData?.find((user) => user.uid === id);
        return user;
    };

    const getUserId = (username: string) => {
        const user = usersData?.find((user) => user.username === username);
        return user?.uid;
    }

    const handleBack = () => {
        router.back();
    };

    const collabList = getScrapbookData(scrap)?.collaborators;
    const collabListMap = Object.keys(collabList || {}).map((key) => [key, collabList[key]]);

    const images = getScrapbookData(scrap)?.posts;
    let validImages = images?.filter((image: any) => image !== "");

    const comments_collection = collection(db, `comment/${scrap}/comments`);
    const comments_query = query(comments_collection);
    const { data: commentsData } = useFirestoreCollectionData(comments_query);
    const comments = commentsData?.map((comment: any) => [comment.username, comment.comment]);

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'scrapbooks', id));
            await deleteDoc(doc(db, 'reportedScrapbooks', id));
            const coverUrl = await getScrapbookData(id)?.coverUrl;
            
            if (coverUrl != "") {
                await deleteObject(ref(storage, `${coverUrl}`));
            }

            validImages?.map(async (image: any) => {
                await deleteObject(ref(storage, `${image}`));
            });
            SuccessToast({ message: 'Deleted', toast });
            router.push('/posts');
        } catch (error : any) {
            ErrorToast({ error: error.message, toast });
            router.push('/posts');
        }
    };

    const handleDeleteUser = () => {
        handleDelete(scrap);
        setIsDeleteModalOpen(false);
    }
    
    const onDeleteImage = async (image: string) => {
        try {
            await deleteObject(ref(storage, `${image}`));
            // remove image from array
            const newImages = images?.filter((img: string) => img !== image);
            validImages = newImages?.filter((image: any) => image !== "");
            // update firestore
            await updateDoc(doc(db, 'scrapbooks', scrap), {
                posts: newImages,
            });
            SuccessToast({ message: 'Deleted', toast });
            router.reload();
        } catch (error: any) {
            ErrorToast({ error: error.message, toast });
        }
    }

    return (
        <div>
            <Flex>
                <IconButton
                    aria-label="Back"
                    colorScheme={'blue'}
                    icon={<ArrowLeftIcon />}
                    onClick={() => handleBack()}
                />
                <Spacer />
                <IconButton
                    aria-label="Delete"
                    colorScheme={'red'}
                    icon={<DeleteIcon />}
                    onClick={() => setIsDeleteModalOpen(true)}
                />
            </Flex>
                <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete User</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete {getScrapbookData(scrap)?.title}?
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
            <VStack spacing={6}>
            <Heading as='h2' size='xl'>Details</Heading>
            <Box borderWidth='3px'>
            <Table variant="simple" size='lg'>
                <Thead>
                    <Tr>
                        <Th>Title</Th>
                        <Th>Caption</Th>
                        <Th>Creator</Th>
                        <Th>Tag</Th>
                        <Th>Type</Th>
                        <Th>Visibility</Th>
                        <Th>Number of Likes</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>{getScrapbookData(scrap)?.title}</Td>
                        <Td>{getScrapbookData(scrap)?.caption}</Td>
                        <Td>{getUserData(getScrapbookData(scrap)?.creatorUid)?.name}</Td>
                        <Td>{getScrapbookData(scrap)?.tag}</Td>
                        <Td>{getScrapbookData(scrap)?.type}</Td>
                        <Td>{getScrapbookData(scrap)?.visibility}</Td>
                        <Td>{getScrapbookData(scrap)?.likes.length}</Td>
                    </Tr>
                </Tbody>
                </Table>
                </Box>
            <HStack spacing={10} alignItems='flex-start'>
                <VStack spacing={6}>
                    <Heading as='h2' size='xl'>Collaborators</Heading>
                    <Box borderWidth='3px'>
                    <Table variant="simple" size='lg'>
                        <Thead>
                            <Tr>
                                <Th>Username</Th>
                                <Th>Group Manager</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                                {collabListMap.map((collab) => (
                                getUserId(collab[0]) !== undefined ?
                                <Tr key={collab[0]}>
                                    <Td _hover={
                                        {
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                            color: 'blue.500',
                                        }
                                    }>
                                        <Link href={{
                                            pathname: '/user',
                                            query: { userUid: getUserId(collab[0]) },
                                        }}>
                                            @{collab[0]}
                                        </Link>
                                    </Td>
                                    <Td>{collab[1] ? "Yes" : "No"}</Td>
                                </Tr> : null
                            ))}
                        </Tbody>
                    </Table>
                    </Box>
                </VStack>
                <VStack spacing={6}>
                        <Heading as='h2' size='xl'>Comments</Heading>
                            
                            <Box borderWidth='3px'>
             <Table variant="simple" size='lg'>
                <Thead>
                    <Tr>
                        <Th>Username</Th>
                        <Th>Comment</Th>
                    </Tr>
                </Thead>
                <Tbody>
                        {comments?.map((comment) => (
                        getUserId(comment[0]) !== undefined ?
                        <Tr key={comment[0]}>
                            <Td _hover={
                                {
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    color: 'blue.500',
                                }
                            }>
                                <Link href={{
                                    pathname: '/user',
                                    query: { userUid: getUserId(comment[0]) },
                                }}>
                                    @{comment[0]}
                                </Link>
                            </Td>
                            <Td>{comment[1]}</Td>
                        </Tr> : null
                    ))}
                </Tbody>
                    </Table>
                    </Box>
                </VStack>
                </HStack>
            </VStack>
            <Box height={6}></Box>
            <VStack spacing={6}>
            <Heading>Cover Photo</Heading>
                <Image
                    boxSize='20%'
                    objectFit='cover'
                    src={getScrapbookData(scrap)?.coverUrl != "" ? getScrapbookData(scrap)?.coverUrl : "/default.png" }
                    alt='Cover Photo'
                />
            </VStack>
            <Box height={6}></Box>
            <VStack spacing={6}>
            <Heading>Images</Heading>

            <Stack direction='row' spacing={6}>
                    {validImages?.map((image: any) => (
                        <Box position="relative" boxSize="20%">
                        <Image
                            boxSize="100%"
                            objectFit="cover"
                            src={image !== "" ? image : "/default.png"}
                            alt="Post"
                        />
                        <IconButton
                            aria-label="Delete post image"
                            icon={<DeleteIcon />}
                            size="sm"
                            position="absolute"
                            top="2"
                            right="2"
                            onClick={() => onDeleteImage(image)}
                        />
                        </Box>
                ))}
                </Stack>
            </VStack>
        </div>
    );
};

export default Scrapbook;