import React from 'react';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { Table, Switch } from 'antd';

import { listProduct } from '../../apis';

export const getServerSideProps = (async () => {
  const data = await listProduct();
  return { props: { products: data.data, total: data.total } };
}) satisfies GetServerSideProps<{ products: []; total: number }>;

const Products: NextPage = ({
  products,
  total,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
      render: (data) => Number(data).toLocaleString('vi-VN'),
    },
    {
      title: 'Tốc độ xử lý',
      dataIndex: 'hashPower',
      key: 'hashPower',
      render: (data) => Number(data).toLocaleString('vi-VN'),
    },
    {
      title: 'Lợi nhuận ngày',
      dataIndex: 'dailyIncome',
      key: 'dailyIncome',
      render: (data) => Number(data).toLocaleString('vi-VN'),
    },
    {
      title: 'Lợi nhuận tháng',
      dataIndex: 'monthlyIncome',
      key: 'monthlyIncome',
      render: (data) => Number(data).toLocaleString('vi-VN'),
    },
    {
      title: 'Tối đa',
      dataIndex: 'maxOut',
      key: 'maxOut',
      render: (data) => Number(data).toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'published',
      key: 'published',
      render: (data) => (
        <Switch
          checkedChildren="Hoạt động"
          unCheckedChildren="Khóa"
          defaultChecked={data}
          disabled
        />
      ),
    },
  ];

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <Table dataSource={products} columns={columns} />
    </div>
  );
};

export default Products;
