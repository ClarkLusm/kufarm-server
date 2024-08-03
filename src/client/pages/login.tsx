'use client';

import { Button, Card, Col, Divider, Form, Row, notification } from 'antd';
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
        const redirectUrl = searchParams.get('redirect');
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
    <Row>
      <Col span={8} offset={8}>
        <Card title="Đăng nhập" bordered={false}>
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
                <div className="mt-10">
                  {contextHolder}
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
                          Đăng nhập
                        </Button>
                      </Form.Item>
                    </Form>
                  </FormikForm>
                </div>
              );
            }}
          </Formik>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
