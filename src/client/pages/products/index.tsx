import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { Table } from "antd";

const Products: NextPage = (props) => {
  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      price: 32,
      power: '10TH/S',
      duration: 360,
      dailyIncome: '10$',
      monthlyIncome: '100$',
      isActive: false
    },
    {
      key: '1',
      name: 'Mike',
      price: 32,
      power: '10TH/S',
      duration: 360,
      dailyIncome: '10$',
      monthlyIncome: '100$',
      isActive: true
    },
  ];

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Tốc độ xử lý',
      dataIndex: 'hashPower',
      key: 'hashPower',
    },
    {
      title: 'Lợi nhuận ngày',
      dataIndex: 'dailyIncome',
      key: 'dailyIncome',
    },
    {
      title: 'Lợi nhuận tháng',
      dataIndex: 'monthlyIncome',
      key: 'monthlyIncome',
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
    },
  ];

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default Products;
