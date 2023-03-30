/* eslint-disable prettier/prettier */
import { collection, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Button, Select, useToast, Box, color } from '@chakra-ui/react';
import { ErrorToast, SuccessToast } from '@/components/toast-component';
import Link from 'next/link';


const Users = () => {
  const toast = useToast();
  const db = useFirestore();
  const reported_users_collection = collection(db, 'reportedUsers');
  const users_collection = collection(db, 'users');
  const reported_query = query(reported_users_collection);
  const users_query = query(users_collection);
  const { data: reportedData } = useFirestoreCollectionData(reported_query);
  const { data: usersData } = useFirestoreCollectionData(users_query);

  const getUserData = (id: string) => {
    const user = usersData?.find((user) => user.uid === id);
    return user;
  };

  const handleStatus = async (id: string, status: string) => {
      await updateDoc(doc(db, 'reportedUsers', id), {
        status: status,
      }).then(response => {
          SuccessToast({ message: 'Updated', toast });
      }).catch(error => {
          ErrorToast({ error: error.message, toast });
      })
  }
  
  return (
    <div>
      <Box borderWidth='3px'> 
      <Box borderRadius="25px" backgroundColor="#322659"> 
      <Table variant="simple" size='lg'>
        <Thead>
          <Tr borderBottom={''}>
            <Th textColor="white" fontSize='xxxl'>User Reported</Th>
            <Th textColor="white" fontSize='xxxl'>Reported By</Th>
            <Th textColor="white" fontSize='xxxl'>Reason</Th>
            <Th textColor="white" fontSize='xxxl'>Actions</Th>
         </Tr>
        </Thead>
        <Tbody>
          {reportedData?.map((report) => (
            <Tr key={report.id}>
              <Td color="white" _hover={
                {
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  color: '#9AE6B4',
                }
              }>
                <Link href={{
                  pathname: '/user',
                  query: { userUid: report.userReportedUid },
                }}>
                  @{getUserData(report.userReportedUid)?.username}
                </Link>
              </Td>
              <Td color="white" _hover={
                {
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  color: '#9AE6B4',
                }
              }>
                <Link href={{
                  pathname: '/user',
                  query: { userUid: report.reporterUid },
                }}>
                  @{getUserData(report.reporterUid)?.username}
                </Link>
              </Td>
              <Td color="white">{report.reportReason}</Td>
              
                <Td textColor="black">
                <Select 
                  bg = "#E6FFFA"
                  placeholder={report.status}
                  onChange={(e) => handleStatus(report.userReportedUid, e.target.value)}
                  variant="solid"
                  borderColor={'#086F83'}
                >
                  {report.status != "Pending" ? <option value="Pending">Pending</option> : null}
                  {report.status != "Under Review" ? <option value="Under Review">Under Review</option> : null}
                  {report.status != "Resolved" ? <option value="Resolved">Resolved</option> : null}
                </Select>
              </Td>
             
            </Tr>
          ))}
        </Tbody>
        </Table>
      </Box>
    </Box>
    </div>
  );
};

export default Users;