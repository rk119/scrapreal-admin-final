export const SuccessToast = ({ message, toast }: any) => {
  return toast({
    title: 'Success!',
    description: message,
    status: 'success',
    duration: 5000,
    isClosable: true
  });
};

export const ErrorToast = ({ error, toast }: any) => {
  return toast({
    title: 'Error!',
    description: error,
    status: 'error',
    duration: 5000,
    isClosable: true
  });
};
