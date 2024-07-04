import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { Request } from 'express';

export async function getServerSideProps({ req }) {
  
  return {
    props: { user: (req as Request).user, orders: [] },
  };
}

const Orders: NextPage = (props) => {
  useEffect(() => {
    window.gtag('event', 'ordersOpened');
  }, []);

  return (
    <div>
      <h1>Orders overview</h1>
    </div>
  );
};

export default Orders;
