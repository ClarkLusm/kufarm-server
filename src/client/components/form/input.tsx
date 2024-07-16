import React from 'react';
import { Form, Input } from 'antd';

export const InputField = (props) => {
  const { field, form, label, placeholder, required } = props,
    { name, value, onChange, onBlur } = field,
    { touched, errors } = form;

  return (
    <Form.Item
      label={label}
      name={name}
      required={required}
      validateStatus={touched[name] && errors[name] ? 'error' : 'success'}
      help={touched[name] && errors[name] ? errors[name] : ''}
    >
      {props.type === 'password' ?
        <Input.Password
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
        :
        <Input
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      }
    </Form.Item>
  );
};
