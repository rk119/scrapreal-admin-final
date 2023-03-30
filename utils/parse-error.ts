const ParseError = (error: any) => {
  const message = /Error \((.*)\)/g
    .exec(error.message)?.[1]
    ?.split('/')
    ?.pop()
    ?.replace(/-/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());

  return message === undefined || null ? 'Something went wrong' : message;
};

export default ParseError;
