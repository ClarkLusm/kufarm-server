import React from 'react';
import { NextPage } from 'next';
import { Table } from 'antd';

const Wallets: NextPage = (props) => {
  const dataSource = [
    {
      key: '1',
      username: 'Tài khoản',
      productName: 'AZ 9 Mini',
      amount: '90$',
      createdAt: '',
      status: '',
    },
    {
      key: '2',
      username: 'Tài khoản',
      productName: 'AZ 9 Mini',
      price: '90$',
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
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
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
      <h1>Cổng thanh toán</h1>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default Wallets;
