import axios from '../axios.config';
import { SETTING_URL } from '../common/constants';

export const listSetting = () => {
  return axios.get(SETTING_URL).then((res) => res.data);
};

export const updateSetting = (key: string, value: any) => {
  return axios.post(SETTING_URL, {
    key,
    value,
  });
};
