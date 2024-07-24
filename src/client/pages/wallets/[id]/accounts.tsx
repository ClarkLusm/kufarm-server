import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Switch, Table } from 'antd';
import { useRouter } from 'next/router';

import { listPaymentAccount } from '../../../apis/payment-wallet';
import { shortAddress } from '../../../common/helpers';
import moment from 'moment';

const PaymentAccounts: NextPage = (props) => {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      fetchData(id);
    }
  }, [router]);

  async function fetchData(id) {
    const { data, total } = await listPaymentAccount(id);
    setAccounts(data);
    setTotal(total);
  }

  const columns = [
    {
      title: 'Địa chỉ ví',
      dataIndex: 'accountAddress',
      key: 'accountAddress',
      render: (data) => shortAddress(data),
    },
    {
      title: 'Số dư',
      dataIndex: 'balance',
      key: 'balance',
      render: (data) => Number(data / 1e18),
    },
    {
      title: 'Cập nhật lúc',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (data) => moment(data).format('HH:mm DD/MM/YY'),
    },
  ];

  return (
    <div>
      <h1>Danh sách tài khoản ví</h1>
      <Table dataSource={accounts} columns={columns} />
    </div>
  );
};

export default PaymentAccounts;
