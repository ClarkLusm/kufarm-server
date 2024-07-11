import React from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb, Layout as BaseLayout } from 'antd';
import { Header, menuItems } from './header';
import Link from 'next/link';
import { useAuth } from '../../contexts/auth.context';

const { Content } = BaseLayout;

export const Layout = ({ children }) => {
  const pathname = usePathname();
  const paths = pathname?.split('/') || [];
  const isPublicRoute = pathname === '/login';
  const auth = useAuth();

  return !isPublicRoute && auth ? (
    <BaseLayout>
      <Header />
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
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
        </Breadcrumb>
        <div
          style={{
            minHeight: 280,
            padding: 24,
          }}
        >
          {children}
        </div>
      </Content>
    </BaseLayout>
  ) : (
    <>{children}</>
  );
};
