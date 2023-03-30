import { collection, query, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useFirestore, useFirestoreCollectionData } from 'reactfire';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Button,
  Select,
  useToast,
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ErrorToast, SuccessToast } from '@/components/toast-component';
import Link from 'next/link';
import { useState } from 'react';

const Admins = () => {
  const toast = useToast();
  const db = useFirestore();
  const auth = useAuth();
  const admins_collection = collection(db, 'admin');
  const admins_query = query(admins_collection);
  const { data: adminsData } = useFirestoreCollectionData(admins_query);

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const getAdminData = (id: string) => {
  //   const admin = adminsData?.find((admin) => admin.uid === id);
  //   return admin;
  // };

  const handleAddAdmin = async () => {
    try {
      setIsLoading(true);
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(admins_collection, {
        email: email,
        username: username,
        name: name,
        uid: user.user?.uid,
      });

      setIsOpen(false);
      setIsLoading(false);
      SuccessToast({ message: "Admin added successfully", toast });
    } catch (error: any) {
      ErrorToast({ error: error.message, toast });
      console.error(error);
    }
  };

   return (
     <div>
       <Flex justifyContent='space-between' alignItems='center'>
          <Heading ml={4} size="xl">Admins</Heading>
          <Button colorScheme='blue' size='md' onClick={() => setIsOpen(true)}>Add Admin</Button>
       </Flex>
      <Box mb={6}></Box>
      <Box borderWidth='3px'>
      <Box borderRadius="25px" backgroundColor="#322659">  
      <Table variant="simple" size='lg'>
        <Thead>
          <Tr>
            <Th textColor='#E9D8FD' fontSize='xl'>Name</Th>
            <Th textColor='#E9D8FD' fontSize='xl'>Username</Th>
            <Th textColor='#E9D8FD' fontSize='3xl'>Email</Th>
          </Tr>
        </Thead>
           <Tbody>
             {adminsData?.map((admin: any) => (
               <Tr key={admin.uid}>
                 <Td textColor="white">{admin.name}</Td>
                 <Td textColor="white">{admin.username}</Td>
                 <Td textColor="white">{admin.email}</Td>
               </Tr>
              ))}
           </Tbody>
         </Table>
         </Box>
       </Box>
             <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Username</FormLabel>
              <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Name</FormLabel>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button isLoading={isLoading} colorScheme="blue" onClick={handleAddAdmin}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Admins;