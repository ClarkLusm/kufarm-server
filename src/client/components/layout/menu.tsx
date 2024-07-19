import React, { useState } from 'react';
import {
  UserOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { useRouter } from 'next/router';

type MenuItem = Required<MenuProps>['items'][number];

export const menuItems = [
  {
    key: '/users',
    label: 'Tài khoản',
  },
  {
    key: '/products',
    label: 'Sản phẩm',
  },
  {
    key: '/transactions',
    label: 'Giao dịch',
  },
  {
    key: '/orders',
    label: 'Đơn hàng',
  },
  {
    key: '/configs',
    label: 'Cấu hình',
  },
];
const items: MenuItem[] = [
  { key: '/users', icon: <UserOutlined />, label: 'Tài khoản' },
  { key: '/products', icon: <DesktopOutlined />, label: 'Sản phẩm' },
  { key: '/transactions', icon: <ContainerOutlined />, label: 'Giao dịch' },
  { key: '/orders', icon: <ContainerOutlined />, label: 'Đơn hàng' },

  {
    key: '/configs',
    label: 'Cấu hình',
    icon: <SettingOutlined />,
    children: [
      { key: '/wallets', label: 'Ví thanh toán' },
    ],
  },
];

export const BaseMenu = () => {
  const router = useRouter();

  const onClick: MenuProps['onClick'] = (e) => router.push(e.key);

  return <Menu mode="inline" items={items} onClick={onClick} />;
};
