import * as yup from 'yup';

export const schema = yup
  .object({
    isOut: yup.boolean(),
    name: yup.string().required(),
    walletAddress: yup.string().required(),
    chainId: yup.number().required(),
    coin: yup.string().required(),
    secret: yup.string().when('isOut', ([isOut], schema) => {
      return isOut ? schema.required() : schema.nullable();
    }),
  })
  .required();
