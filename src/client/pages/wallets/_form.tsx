import { Button, Form, Input, Select, Switch, Spin, notification } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';

import { createPaymentWallet, updatePaymentWallet } from '../../apis';
import { Network, PaymentWallet } from '../../common/types';
import { schema } from './_schema';

type FormProps = {
  defaultValues?: PaymentWallet | null;
  onClose: Function;
  networks: Network[];
};

export const WalletForm = (props: FormProps) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm<PaymentWallet>({
    defaultValues: props.defaultValues,
    resolver: yupResolver(schema),
  });
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [tokens, setTokens] = useState([]);
  const chainId = watch('chainId');

  useEffect(() => {
    const network = props.networks.find((n) => n.chainId === chainId);
    setTokens(network?.tokens || []);
  }, [chainId]);

  const onSubmit: SubmitHandler<PaymentWallet> = async (data) => {
    try {
      setLoading(true);
      const walletId = props.defaultValues?.id;
      if (walletId) {
        await updatePaymentWallet(walletId, data);
      } else {
        await createPaymentWallet({ ...data, isOut: data?.isOut || false });
      }
      api.success({
        message: `Thành công`,
        description: walletId
          ? 'Cập nhật thông tin ví thành công'
          : 'Thêm mới ví thành công',
        placement: 'topRight',
        icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
      });
      props.onClose(true);
    } catch (error) {
      api.error({
        message: `Thất bại`,
        description:
          error?.response?.data?.message ??
          'Có lỗi xảy ra. Vui lòng thử lại sau',
        placement: 'topRight',
        icon: <CloseCircleFilled style={{ color: '#ff4d4f' }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          autoComplete="off"
          onFinish={handleSubmit(onSubmit)}
        >
          <Form.Item
            label="Tên ví"
            required
            validateStatus={!!errors.name ? 'error' : 'validating'}
            help={errors.name?.message}
          >
            <Controller
              {...register('name')}
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item
            label="Mạng"
            required
            validateStatus={!!errors.chainId ? 'error' : 'validating'}
            help={errors.chainId?.message}
          >
            <Controller
              {...register('chainId')}
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  {props.networks.map((n) => (
                    <Select.Option key={n.chainId} value={n.chainId}>
                      {n.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>
          <Form.Item
            label="Đồng"
            required
            validateStatus={!!errors.coin ? 'error' : 'validating'}
            help={errors.coin?.message}
          >
            <Controller
              {...register('coin')}
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  {tokens?.map((token) => (
                    <Select.Option key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>
          <Form.Item
            label="Địa chỉ ví"
            required
            validateStatus={!!errors.walletAddress ? 'error' : 'validating'}
            help={errors.walletAddress?.message}
          >
            <Controller
              {...register('walletAddress')}
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label="Kiểu ví" valuePropName="checked">
            <Controller
              {...register('isOut')}
              control={control}
              render={({ field }) => (
                <Switch
                  defaultValue={false}
                  {...field}
                  checkedChildren="Ví rút"
                  unCheckedChildren="Ví nạp"
                />
              )}
            />
          </Form.Item>
          {getValues('isOut') === true && (
            <Form.Item
              required
              label="Mã bảo mật"
              validateStatus={!!errors.secret ? 'error' : 'validating'}
              help={errors.secret?.message}
            >
              <Controller
                {...register('secret')}
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          )}
          <Form.Item label="Trạng thái hoạt động" valuePropName="checked">
            <Controller
              {...register('published')}
              control={control}
              render={({ field }) => (
                <Switch
                  {...field}
                  checkedChildren="Hoạt động"
                  unCheckedChildren="Đã khóa"
                />
              )}
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-8">
            <Button
              icon={<CloseCircleOutlined />}
              onClick={() => props.onClose(false)}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSubmit(onSubmit)}
            >
              Lưu
            </Button>
          </div>
        </Form>
      </Spin>
    </>
  );
};
