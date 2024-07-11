import * as Yup from 'yup'

export const productSchema = Yup.object().shape({
  name: Yup.string().required('Không được bỏ trống'),
  price: Yup.string().required('Không được bỏ trống'),
  hashPower: Yup.string().required('Không được bỏ trống'),
  dailyIncome: Yup.string().required('Không được bỏ trống'),
  monthlyIncome: Yup.string().required('Không được bỏ trống'),
  duration: Yup.string().required('Không được bỏ trống'),
})
