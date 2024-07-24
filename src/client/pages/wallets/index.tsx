import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Switch, Table } from 'antd';
import ArrowLeftOutlined from '@ant-design/icons/lib/icons/ArrowLeftOutlined';
import ArrowRightOutlined from '@ant-design/icons/lib/icons/ArrowRightOutlined';

import { listPaymentWallet } from '../../apis/payment-wallet';
import { NETWORKS } from '../../common/constants/networks';
import { shortAddress } from '../../common/helpers';

const Wallets: NextPage = (props) => {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const data = await listPaymentWallet();
    setWallets(data);
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
            <ArrowLeftOutlined style={{ color: 'green' }} />
            {` `} Ví nạp
          </>
        ) : (
          <>
            <ArrowRightOutlined style={{ color: 'red' }} />
            {` `} Ví rút
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
  ];

  return (
    <div>
      <h1>Cổng thanh toán</h1>
      <Table dataSource={wallets} columns={columns} />
    </div>
  );
};

export default Wallets;
