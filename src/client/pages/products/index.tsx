import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Table, Switch, Dropdown, Button, Drawer } from 'antd';
import { EditOutlined, MoreOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-components';

import { Product } from '../../common/types';
import { listProduct } from '../../apis';
import { ProductForm } from './_form';

const Products: NextPage = (props) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [item, setItem] = useState<Product | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data, total } = await listProduct();
    setProducts(data);
    setTotal(total);
  }

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
      render: (data) => Number(data).toLocaleString('en-EN'),
    },
    {
      title: 'Tốc độ xử lý',
      dataIndex: 'hashPower',
      key: 'hashPower',
      render: (data) => Number(data).toLocaleString('en-EN'),
    },
    {
      title: 'Lợi nhuận ngày',
      dataIndex: 'dailyIncome',
      key: 'dailyIncome',
      render: (data) => Number(data).toLocaleString('en-EN'),
    },
    {
      title: 'Lợi nhuận tháng',
      dataIndex: 'monthlyIncome',
      key: 'monthlyIncome',
      render: (data) => Number(data).toLocaleString('en-EN'),
    },
    {
      title: 'Tối đa',
      dataIndex: 'maxOut',
      key: 'maxOut',
      render: (data) => Number(data).toLocaleString('en-EN'),
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
    {
      key: 'action',
      render: (_, record) => (
        <Dropdown
          placement="bottomRight"
          menu={{
            items: [
              {
                label: (
                  <span onClick={() => onEdit(record)}>
                    <EditOutlined /> Edit
                  </span>
                ),
                key: '0',
              },
            ],
          }}
        >
          <MoreOutlined />
        </Dropdown>
      ),
    },
  ];

  const onCloseDrawer = () => {
    setItem(null);
    setOpen(false);
  };

  const onEdit = (record) => {
    setItem(record);
    setOpen(true);
  };

  const onCloseForm = (refreshList?: boolean) => {
    if (refreshList) {
      fetchData();
    }
    onCloseDrawer();
  };

  return (
    <div>
      <PageHeader
        ghost={false}
        title="Danh sách sản phẩm"
        extra={[
          <Button key="1" type="primary" onClick={() => setOpen(true)}>
            Thêm mới
          </Button>,
        ]}
      />
      <Table dataSource={products} columns={columns} />
      <Drawer
        closable
        destroyOnClose
        title={<p>{!item ? 'Thêm mới sản phẩm' : 'Cập nhật thông tin sản phẩm'}</p>}
        placement="right"
        open={open}
        onClose={onCloseDrawer}
      >
        <ProductForm
          key={item?.id}
          defaultValues={item}
          onClose={onCloseForm}
        />
      </Drawer>
    </div>
  );
};

export default Products;
