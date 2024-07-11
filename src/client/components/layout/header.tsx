import { useRouter } from 'next/router';
import { Layout as BaseLayout, Menu, MenuProps } from 'antd';

const { Header: BaseHeader } = BaseLayout;

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

export const Header = () => {
  const router = useRouter();

  const onClick: MenuProps['onClick'] = (e) => router.push(e.key);

  return (
    <BaseHeader style={{ display: 'flex', alignItems: 'center' }}>
      {/* <div className="demo-logo" /> */}
      <Menu
        theme="dark"
        mode="horizontal"
        onClick={onClick}
        defaultSelectedKeys={['1']}
        items={menuItems}
        style={{ flex: 1, minWidth: 0 }}
      />
    </BaseHeader>
  );
};
