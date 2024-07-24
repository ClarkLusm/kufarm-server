import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Badge, Table } from 'antd';
import moment from 'moment';

import { listOrder } from '../../apis/order';

const Orders: NextPage = (props) => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data, total } = await listOrder();
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
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (_, record) => record?.product?.name ?? '',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) =>
        Number(record?.product?.price).toLocaleString('vi-VN') + '$',
    },
    {
      title: 'Thanh toán',
      dataIndex: 'amount',
      key: 'amount',
      render: (data, record) =>
        Number(data/1e18).toLocaleString('vi-VN') + ' ' + record.coin,
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
      <h1>Đơn hàng</h1>
      <Table dataSource={orders} columns={columns} />
    </div>
  );
};

export default Orders;
