import React from 'react';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { Switch, Table } from 'antd';
import moment from 'moment';
import CheckCircleOutlined from '@ant-design/icons/lib/icons/CheckCircleOutlined';

import { listUser } from '../../apis';
import { shortAddress } from '../../common/helpers';

export const getServerSideProps = (async () => {
  const data = await listUser();
  return { props: { users: data.data, total: data.total } };
}) satisfies GetServerSideProps<{ users: []; total: number }>;

const Users: NextPage = ({
  users,
  total,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Đã xác thực',
      dataIndex: 'emailVerified',
      key: 'emailVerified',
      render: (data) => (data ? <CheckCircleOutlined /> : null),
    },
    {
      title: 'Địa chỉ ví',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      render: (data) => shortAddress(data),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (data) => moment(data).format('HH:mm DD/MM/YY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'bannedAt',
      key: 'bannedAt',
      render: (data) => (
        <Switch
          checkedChildren="Hoạt động"
          unCheckedChildren="Khóa"
          defaultChecked={!data}
          disabled
        />
      ),
    },
  ];

  return (
    <div>
      <h1>Danh sách người dùng</h1>
      <Table dataSource={users} columns={columns} />
    </div>
  );
};

export default Users;
