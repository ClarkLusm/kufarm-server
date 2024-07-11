import React from 'react';
import { AppProps } from 'next/app';
import Script from 'next/script';
import { Layout } from '../components/layout';
import { setupAxios } from '../axios.config';
import { AuthInit } from '../contexts/auth.context';
// import 'tailwindcss/tailwind.css';
import '../global.css';

setupAxios();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `}
      </Script>
      <Layout>
        <AuthInit>
          <Component {...pageProps} />
        </AuthInit>
      </Layout>
    </>
  );
};

export default App;
