import React from 'react';
import { AppProps } from 'next/app';

import { Layout } from '../components/layout';
import { AuthInit } from '../contexts/auth.context';
import '../global.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthInit>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthInit>
  );
};

export default App;
