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
import moment from 'moment';
import * as ethers from 'ethers';

import { listPaymentWallet } from '../../apis/payment-wallet';
import { shortAddress } from '../../common/helpers';
import { PaymentWallet } from '../../common/types';
import { WalletForm } from './_form';

const Wallets: NextPage = (props) => {
  const [wallets, setWallets] = useState([]);
  const [total, setTotal] = useState(0);
  const [networks, setNetworks] = useState({});
  const [open, setOpen] = React.useState<boolean>(false);
  const [item, setItem] = useState<PaymentWallet | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await listPaymentWallet();
      const { data, total, networks } = res;
      setWallets(data);
      setTotal(total);
      setNetworks(networks);
    } catch (error) {
      console.error(error);
    }
  }

  const columns = [
    {
      title: 'Tên ví',
      dataIndex: 'name',
      key: 'name',
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
      render: (data) => networks?.[data]?.name,
    },
    {
      title: 'Đồng',
      dataIndex: 'coin',
      key: 'coin',
    },
    {
      title: 'Số dư',
      dataIndex: 'balance',
      key: 'balance',
      render: (data, row) => {
        const network = networks[row.chainId];
        const token = network.tokens.find((t) => t.symbol === row.coin);
        return ethers.formatUnits(
          data.toLocaleString('fullwide', { useGrouping: false }),
          token.decimals,
        );
      },
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
      title: 'Đồng bộ lần cuối',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (data) => moment(data).format('HH:mm DD/MM/YYYY'),
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
        <WalletForm
          key={item?.id}
          networks={Object.values(networks)}
          defaultValues={item}
          onClose={onCloseForm}
        />
      </Drawer>
    </div>
  );
};

export default Wallets;
