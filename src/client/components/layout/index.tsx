import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Layout as BaseLayout, Button, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import { useAuth } from '../../contexts/auth.context';
import { BaseMenu } from './menu';

const { Header, Content, Sider } = BaseLayout;

export const Layout = ({ children }) => {
  const pathname = usePathname();
  const isPublicRoute = pathname === '/login';
  const auth = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return !isPublicRoute && auth ? (
    <BaseLayout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ height: '100vh', background: colorBgContainer }}>
          <div className="demo-logo-vertical" />
          <BaseMenu />
        </div>
      </Sider>
      <BaseLayout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {paths.map((p) => {
              const route = menuItems.find((i) => i.key === `/${p}`);
              if (route) {
                return (
                  <Breadcrumb.Item key={route.key}>
                    <Link href={route.key}>{route.label}</Link>
                  </Breadcrumb.Item>
                );
              }
              return p && <Breadcrumb.Item>{p}</Breadcrumb.Item>;
            })}
          </Breadcrumb> */}
          {/* <div
            style={{
              minHeight: 280,
              padding: 24,
            }}
          > */}
          {children}
          {/* </div> */}
        </Content>
      </BaseLayout>
    </BaseLayout>
  ) : (
    <>{children}</>
  );
};
