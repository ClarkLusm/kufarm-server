import React from 'react';
import { NextPage } from 'next';
import { Table } from 'antd';

const Users: NextPage = (props) => {
  const dataSource = [
    {
      key: '1',
      username: 'Mike',
      email: 32,
      btcWallet: '10 Downing Street',
      createdAt: '',
    },
    {
      key: '2',
      username: 'John',
      email: 42,
      btcWallet: '10 Downing Street',
      createdAt: '',
    },
  ];

  const columns = [
    {
      title: 'Tên hiển thị',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Địa chỉ ví',
      dataIndex: 'btcWallet',
      key: 'btcWallet',
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
      <h1>Danh sách người dùng</h1>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default Users;
