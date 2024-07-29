import { Button, Form, Input, Switch, Spin, notification } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';

import { createProduct, updateProduct } from '../../apis';
import { NumberInput } from '../../components/form/input';
import { Product } from '../../common/types';
import { productSchema } from './_schema';

type FormProps = {
  defaultValues?: Product | null;
  onClose: Function;
};

export const ProductForm = (props: FormProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>({
    defaultValues: props.defaultValues,
    resolver: yupResolver(productSchema),
  });
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Product> = async (data) => {
    try {
      setLoading(true);
      const productId = props.defaultValues?.id;
      if (productId) {
        await updateProduct(productId, data);
      } else {
        await createProduct(data);
      }
      api.success({
        message: `Thành công`,
        description: productId
          ? 'Cập nhật thông tin sản phẩm thành công'
          : 'Thêm mới sản phẩm thành công',
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
            label="Tên sản phẩm"
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
            label="Công suất băm"
            required
            validateStatus={!!errors.hashPower ? 'error' : 'validating'}
            help={errors.hashPower?.message}
          >
            <Controller
              {...register('hashPower')}
              control={control}
              render={({ field }) => <NumberInput {...field} />}
            />
          </Form.Item>
          <Form.Item
            label="Lợi nhuận ngày"
            required
            validateStatus={!!errors.dailyIncome ? 'error' : 'validating'}
            help={errors.dailyIncome?.message}
          >
            <Controller
              {...register('dailyIncome')}
              control={control}
              render={({ field }) => <NumberInput {...field} />}
            />
          </Form.Item>
          <Form.Item
            label="Lợi nhuận tháng"
            required
            validateStatus={!!errors.monthlyIncome ? 'error' : 'validating'}
            help={errors.monthlyIncome?.message}
          >
            <Controller
              {...register('monthlyIncome')}
              control={control}
              render={({ field }) => <NumberInput {...field} />}
            />
          </Form.Item>
          <Form.Item
            required
            label="Tổng lợi nhuận"
            validateStatus={!!errors.maxOut ? 'error' : 'validating'}
            help={errors.maxOut?.message}
          >
            <Controller
              {...register('maxOut')}
              control={control}
              render={({ field }) => <NumberInput {...field} />}
            />
          </Form.Item>
          <Form.Item
            label="Giá bán"
            required
            validateStatus={!!errors.price ? 'error' : 'validating'}
            help={errors.price?.message}
          >
            <Controller
              {...register('price')}
              control={control}
              render={({ field }) => <NumberInput {...field} />}
            />
          </Form.Item>
          <Form.Item
            label="Giá sale"
            validateStatus={!!errors.salePrice ? 'error' : 'validating'}
            help={errors.salePrice?.message}
          >
            <Controller
              {...register('salePrice')}
              control={control}
              render={({ field }) => <NumberInput {...field} />}
            />
          </Form.Item>
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
