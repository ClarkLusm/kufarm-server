import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Button, Switch, Table, Drawer, Dropdown } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import {
  EditOutlined,
  MoreOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

import { listPaymentWallet } from '../../apis/payment-wallet';
import { NETWORKS } from '../../common/constants/networks';
import { shortAddress } from '../../common/helpers';
import { PaymentWallet } from '../../common/types';
import { WalletForm } from './_form';

const Wallets: NextPage = (props) => {
  const [wallets, setWallets] = useState([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [item, setItem] = useState<PaymentWallet | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data, total } = await listPaymentWallet();
    setWallets(data);
    setTotal(total);
  }

  const columns = [
    {
      title: 'Tên ví',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đồng',
      dataIndex: 'coin',
      key: 'coin',
    },
    {
      title: 'Loại ví',
      dataIndex: 'isOut',
      key: 'isOut',
      render: (data) =>
        data ? (
          <>
            <ArrowRightOutlined style={{ color: 'red' }} />
            {` `} Ví rút
          </>
        ) : (
          <>
            <ArrowLeftOutlined style={{ color: 'green' }} />
            {` `} Ví nạp
          </>
        ),
    },
    {
      title: 'Địa chỉ ví',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      render: (data) => shortAddress(data),
    },
    {
      title: 'Mạng',
      dataIndex: 'chainId',
      key: 'chainId',
      render: (data) => NETWORKS?.[data]?.name,
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
        title="Cổng thanh toán"
        extra={[
          <Button key="1" type="primary" onClick={() => setOpen(true)}>
            Thêm mới
          </Button>,
        ]}
      />
      <Table dataSource={wallets} columns={columns} />
      <Drawer
        closable
        destroyOnClose
        title={<p>{!item ? 'Thêm mới ví' : 'Cập nhật thông tin ví'}</p>}
        placement="right"
        open={open}
        onClose={onCloseDrawer}
      >
        <WalletForm key={item?.id} defaultValues={item} onClose={onCloseForm} />
      </Drawer>
    </div>
  );
};

export default Wallets;
