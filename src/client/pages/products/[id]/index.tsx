import { Button, Form, Switch } from 'antd';
import {
  FastField,
  Formik,
  FormikHelpers,
  Form as FormFormik,
} from 'formik';
import { toast } from 'react-toastify';

import { IProduct } from '../../../common/interfaces/product.interface';
import { InputField } from '../../../components/form/input';
import { productSchema } from './schema';

const Page = () => {
  const handleSubmit = async (
    values: IProduct | {},
    { setSubmitting, resetForm }: FormikHelpers<IProduct>,
  ) => {
    setSubmitting(true);
    try {
      toast.success('Thêm mới thành công');
      resetForm();
    } catch (error: any) {
      const resMessage = error?.response?.data?.message;
      const errorMsg = resMessage instanceof Array ? resMessage.join('\n') : '';
      toast.error(`Thêm mới thất bại.\n${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      key="product-form"
      enableReinitialize
      initialValues={{}}
      validationSchema={productSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          isValid,
          getFieldProps,
          setFieldValue,
        } = formik;

        return (
          <FormFormik>
            <Form
              component="div"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
              layout="horizontal"
              style={{ maxWidth: 600 }}
            >
              <FastField
                required
                {...getFieldProps('name')}
                label="Tên sản phẩm"
                component={InputField}
                disabled={isSubmitting}
              />
              <FastField
                required
                {...getFieldProps('price')}
                label="Giá bán"
                component={InputField}
                disabled={isSubmitting}
              />
              <FastField
                required
                {...getFieldProps('duration')}
                label="Thời gian sử dụng"
                component={InputField}
                disabled={isSubmitting}
              />
              <FastField
                required
                {...getFieldProps('hashPower')}
                label="Tốc độ xử lý"
                component={InputField}
                disabled={isSubmitting}
              />
              <FastField
                required
                {...getFieldProps('dailyIncome')}
                label="Lợi nhuận ngày"
                component={InputField}
                disabled={isSubmitting}
              />
              <FastField
                required
                {...getFieldProps('monthlyIncome')}
                label="Lợi nhuận tháng"
                component={InputField}
                disabled={isSubmitting}
              />
              <Form.Item
                label="Trạng thái"
                valuePropName="checked"
                name="isActive"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </FormFormik>
        );
      }}
    </Formik>
  );
};

export default Page;
