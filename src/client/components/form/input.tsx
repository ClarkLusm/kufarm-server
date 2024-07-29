import React from 'react';
import { Form, Input, InputNumber } from 'antd';

import { strToNumberFormat } from '../../common/helpers';

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
      {props.type === 'password' ? (
        <Input.Password
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      ) : (
        <Input
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      )}
    </Form.Item>
  );
};

export const NumberInput = (props) => {
  return (
    <InputNumber<number>
      style={{ width: '100%' }}
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
      {...props}
    />
  );
};
