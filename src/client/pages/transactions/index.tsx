import React from 'react';
import { NextPage } from 'next';
import { Table } from 'antd';

const Transactions: NextPage = (props) => {
  const dataSource = [
    {
      key: '1',
      username: 'Tài khoản',
      sender: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
      receiver: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
      amount: '90',
      createdAt: '',
      status: '',
    },
    {
      key: '2',
      username: 'Tài khoản',
      sender: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
      receiver: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
      amount: '90',
      createdAt: '',
      status: '',
    },
  ];

  const columns = [
    {
      title: 'Tài khoản',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Ví gửi',
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: 'Ví nhận',
      dataIndex: 'receiver',
      key: 'receiver',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div>
      <h1>Giao dịch</h1>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default Transactions;
