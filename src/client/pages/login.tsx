'use client';

import { Button, Form, notification } from 'antd';
import { Formik, Form as FormikForm, FastField } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { NextPage } from 'next';

import { login } from '../apis/auth';
import { InputField } from '../components/form/input';
import { useAuth } from '../contexts/auth.context';
import { tokenIsExpired } from '../common/helpers/auth.helper';
import { EventBus } from '../common/event-bus';

const Login: NextPage = (props) => {
  const { saveAuth, auth } = useAuth();
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (auth) {
      if (tokenIsExpired(auth?.accessToken)) {
        EventBus.emit('logout');
      } else {
        navigation.push('/');
      }
    }
  }, []);

  const openNotification = (message) => {
    api.error({
      message: 'Đăng nhập thất bại',
      description: message,
      placement: 'top',
    });
  };

  function handleSubmit(values) {
    login(values.username, values.password)
      .then((res) => {
        saveAuth(res.data.user);
        const redirectUrl = searchParams.get('redirect_url');
        if (redirectUrl) {
          navigation.push(redirectUrl);
        } else {
          navigation.push('/');
        }
      })
      .catch((err) => {
        openNotification(err?.response?.data?.message || 'Lỗi không xác định');
      });
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
            {contextHolder}
            <div className="bg-white pt-24 pb-4 px-24 m-auto max-w-screen-sm min-h-screen">
              <div className="flex flex-col">
                <h1 className="text-3xl">Đăng nhập</h1>
                <hr className="my-4" />
                <FormikForm>
                  <Form layout="vertical" component="div">
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
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="mt-4 w-full"
                      >
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
