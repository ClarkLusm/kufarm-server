import { Button, Divider, Input, Form } from 'antd';
import { useFormik } from 'formik';
import { NextPage } from 'next';

import { login } from '../api/auth';

type FieldType = {
  username?: string;
  password?: string;
};

const Login: NextPage = (props) => {
  function handleSubmit(values) {
    login(values).then().catch();
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: handleSubmit,
  });

  return (
    <div className="text-3x">
      <Form
        name="login"
        layout="vertical"
        style={{ maxWidth: 600 }}
        onFinish={formik.handleSubmit}
        initialValues={{ remember: true }}
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
