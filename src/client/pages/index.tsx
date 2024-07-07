import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { redirect } from 'next/navigation';

const Home: NextPage<{ message: string; query: string }> = (props) => {
  const { message, query } = props;

  return (
    <div>
      <h1>Hello from NextJS14 - Home</h1>
      {message}
      {query}
    </div>
  );
};

export default Home;
