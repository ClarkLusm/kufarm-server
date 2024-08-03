import * as Yup from 'yup'

export const productSchema = Yup.object().shape({
  name: Yup.string().required('Không được bỏ trống'),
  price: Yup.number().min(1).required('Không được bỏ trống'),
  salePrice: Yup.number().nullable().optional(),
  hashPower: Yup.number().required('Không được bỏ trống'),
  dailyIncome: Yup.number().required('Không được bỏ trống'),
  monthlyIncome: Yup.number().required('Không được bỏ trống'),
  maxOut: Yup.number().required('Không được bỏ trống'),
})
