import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';

const Page = () => {
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'UserName',
      children: 'pthanhhumg',
    },
    {
      key: '2',
      label: 'Email',
      children: 'thanh@gmail.com',
    },
    {
      key: '3',
      label: 'BTC Wallet',
      children: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    },
    {
      key: '4',
      label: 'Balance',
      children: '10$',
    },
    {
      key: '5',
      label: 'Referral Balance',
      children: '0$',
    },
    {
      key: '6',
      label: 'Mining power',
      children: '10 TH/S',
    },
  ];

  return (
    <div>
      <Descriptions title="User Info" layout="vertical" items={items} />
    </div>
  );
};

export default Page;
