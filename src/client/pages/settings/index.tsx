import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Card, InputNumber, Space, Spin, Button, Switch } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

import { listSetting, updateSetting } from '../../apis';
import * as Constants from '../../../server/common/constants';

const Configs: NextPage = (props) => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await listSetting();
      setSettings(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function getSettingByKey(key: string) {
    const record = settings?.find((s) => s.key === key);
    return record?.value;
  }

  const referralIncome = getSettingByKey(Constants.SETTING_REFERRAL_INCOME);
  const referralIncomeCondition = getSettingByKey(
    Constants.SETTING_REFERRAL_INCOME_CONDITION,
  );
  const systemConfig = getSettingByKey(Constants.SETTING_SYSTEM);

  const onChangeSettings = (key: string, value: any) => {
    const changes = settings.map((s) => (s.key === key ? { ...s, value } : s));
    setSettings(changes);
  };

  const onSave = async (key: string) => {
    try {
      setLoading(true);
      await updateSetting(key, getSettingByKey(key));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const CardBase = ({ children, settingKey, title }) => {
    return (
      <Card
        title={title}
        className="mb-4"
        style={{ marginBottom: 16 }}
        bordered={false}
        extra={
          <Button type="primary" onClick={() => onSave(settingKey)}>
            <SaveOutlined />
            Lưu
          </Button>
        }
      >
        {children}
      </Card>
    );
  };

  return (
    <Spin spinning={loading}>
      <CardBase
        title={'Cấu hình hệ thống'}
        settingKey={Constants.SETTING_SYSTEM}
      >
        {typeof systemConfig !== 'undefined' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <InputNumber
                addonBefore="Phần trăm lợi nhuận"
                addonAfter="%"
                value={systemConfig?.incomeRate}
                onChange={(value) =>
                  onChangeSettings(Constants.SETTING_SYSTEM, {
                    ...systemConfig,
                    incomeRate: value,
                  })
                }
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <InputNumber
                addonBefore="Số dư rút tối thiểu"
                addonAfter="BTCO2"
                value={systemConfig?.withdrawMin}
                onChange={(value) =>
                  onChangeSettings(Constants.SETTING_SYSTEM, {
                    ...systemConfig,
                    withdrawMin: value,
                  })
                }
              />
            </div>
            <div>
              <Switch
                checkedChildren="Cố định tỉ giá"
                unCheckedChildren="Tỉ giá tự động"
                checked={!!systemConfig.exchangeFixed}
                onChange={(checked) =>
                  onChangeSettings(Constants.SETTING_SYSTEM, {
                    ...systemConfig,
                    exchangeFixed: checked,
                  })
                }
              />
              <Space style={{ marginLeft: 8 }}>
                <Space.Compact>
                  <InputNumber
                    addonBefore="USD"
                    style={{ width: '50%' }}
                    value={systemConfig?.exchangeUsd}
                    onChange={(value) =>
                      onChangeSettings(Constants.SETTING_SYSTEM, {
                        ...systemConfig,
                        exchangeUsd: value,
                      })
                    }
                    disabled={!systemConfig.fixed}
                  />
                  <InputNumber
                    addonBefore="BTCO2"
                    style={{ width: '50%' }}
                    value={systemConfig?.exchangeToken}
                    onChange={(value) =>
                      onChangeSettings(Constants.SETTING_SYSTEM, {
                        ...systemConfig,
                        exchangeToken: value,
                      })
                    }
                    disabled={!systemConfig.fixed}
                  />
                </Space.Compact>
              </Space>
            </div>
          </>
        )}
      </CardBase>
      <CardBase
        title="Tỉ lệ hoa hồng"
        settingKey={Constants.SETTING_REFERRAL_INCOME}
      >
        {typeof referralIncome !== 'undefined' &&
          Object.entries(referralIncome).map((s) => (
            <Card.Grid style={{ width: '20%' }}>
              <InputNumber
                addonBefore={s[0]}
                value={s?.[1]?.toString()}
                onChange={(value) =>
                  onChangeSettings(Constants.SETTING_REFERRAL_INCOME, {
                    ...referralIncome,
                    [s[0]]: value,
                  })
                }
              />
            </Card.Grid>
          ))}
      </CardBase>
      <CardBase
        title={'Điều kiện nhận hoa hồng'}
        settingKey={Constants.SETTING_REFERRAL_INCOME_CONDITION}
      >
        {typeof referralIncomeCondition !== 'undefined' &&
          Object.entries(referralIncomeCondition).map((s) => (
            <Card.Grid style={{ width: '20%' }}>
              <InputNumber
                addonBefore={s[0]}
                value={s?.[1]?.toString()}
                onChange={(value) =>
                  onChangeSettings(
                    Constants.SETTING_REFERRAL_INCOME_CONDITION,
                    {
                      ...referralIncomeCondition,
                      [s[0]]: value,
                    },
                  )
                }
              />
            </Card.Grid>
          ))}
      </CardBase>
    </Spin>
  );
};

export default Configs;
