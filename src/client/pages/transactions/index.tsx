import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Badge, Table } from 'antd';
import moment from 'moment';

import { listTransaction } from '../../apis/transaction';
import { shortAddress } from '../../common/helpers';

const Transactions: NextPage = (props) => {
  const [transacitons, setOrders] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data, total } = await listTransaction();
    setOrders(data);
    setTotal(total);
  }

  const columns = [
    {
      title: 'Tài khoản',
      dataIndex: 'username',
      key: 'username',
      render: (_, record) => record?.user?.email ?? '',
    },
    {
      title: 'Ví rút',
      dataIndex: 'sender',
      key: 'sender',
      render: (_, record) => shortAddress(record?.user?.walletAddress ?? ''),
    },
    {
      title: 'Ví nhận',
      dataIndex: 'receiver',
      key: 'receiver',
      render: (_, record) =>
        shortAddress(record?.paymentAccount?.accountAddress ?? ''),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (data, record) =>
        Number(data / 1e18).toLocaleString('vi-VN') + ' ' + record.coin,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amountUsd',
      key: 'amountUsd',
      render: (data) => Number(data).toLocaleString('vi-VN') + '$',
    },
    {
      title: 'Thời gian',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (data) => moment(data).format('HH:mm DD/MM/YY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (data) =>
        data == 0 ? (
          <Badge color="orange" count={'Đang xử lý'} />
        ) : data == 1 ? (
          <Badge color="red" count={'Lỗi'} />
        ) : data == 2 ? (
          <Badge color="green" count={'Thành công'} />
        ) : null,
    },
  ];

  return (
    <div>
      <h1>Giao dịch</h1>
      <Table dataSource={transacitons} columns={columns} />
    </div>
  );
};

export default Transactions;
