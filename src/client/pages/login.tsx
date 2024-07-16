import { Button, Form } from 'antd';
import { Formik, Form as FormikForm, FastField } from 'formik';
import { NextPage } from 'next';

import { login } from '../api/auth';
import { InputField } from '../components/form/input';

const Login: NextPage = (props) => {
  function handleSubmit(values) {
    console.log(values);

    login(values).then().catch();
  }

  return (
    <Formik
      key="login-form"
      enableReinitialize
      initialValues={{}}
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
          <div className="bg-gray-100">
            <div className="bg-white pt-24 pb-4 px-24 m-auto max-w-screen-sm min-h-screen">
              <div className='flex flex-col'>
                <h1 className='text-3xl'>Đăng nhập</h1>
                <hr className='my-4' />
                <FormikForm>
                  <Form
                    layout="vertical"
                    component="div"
                  >
                    <FastField
                      required
                      {...getFieldProps('username')}
                      label="Tên đăng nhập"
                      component={InputField}
                      disabled={isSubmitting}
                    />
                    <FastField
                      required
                      {...getFieldProps('password')}
                      label="Mật khẩu"
                      type="password"
                      component={InputField}
                      disabled={isSubmitting}
                    />
                    <Form.Item>
                      <Button type="primary" htmlType="submit" className='mt-4 w-full'>
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </FormikForm>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default Login;
