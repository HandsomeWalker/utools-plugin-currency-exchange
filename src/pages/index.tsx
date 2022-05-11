import '@/styles/icon.css';
import iconImg from '@/assets/24.png';
import styles from './index.less';
import currency from '@/assets/currency.json';
import useRateScript from '@/hooks/useRateScript';
import {
  Select,
  Space,
  Spin,
  message,
  Button,
  List,
  InputNumber,
  Avatar,
} from 'antd';
import { ReloadOutlined, PlusOutlined, DeleteFilled } from '@ant-design/icons';
import { useState, useCallback } from 'react';
import { getIconClassName, simpleDeepCopy } from '@/utils';
import { multiply, divide, fix } from 'mathjs';

interface ListItemProps {
  iso: string;
  title: string;
  value: number;
}

const options = currency.map((item, idx) => ({ ...item, key: idx }));

export default function IndexPage() {
  const [list, setList] = useState<ListItemProps[]>([
    {
      title: '人名币(CNY)',
      iso: 'CNY:CUR',
      value: 0,
    },
    {
      title: '美元(USD)',
      iso: 'USD:CUR',
      value: 0,
    },
  ]);

  const {
    data: price,
    loading,
    run,
  } = useRateScript({
    onError(e) {
      message.error('请求汇率数据出错，请点击刷新按钮重试');
    },
  });

  const onInputNumberChange = useCallback(
    (value, iso) => {
      if (value === null) {
        return;
      }
      let temp = simpleDeepCopy(list);
      for (const item of temp) {
        if (item.iso === iso) {
          item.value = value;
        } else {
          item.value = fix(
            divide(multiply(price[item.iso], value), price[iso]) as number,
            2,
          );
        }
      }
      setList(temp);
    },
    [price],
  );

  const onAddClick = useCallback(() => {}, []);

  return (
    <Spin spinning={loading}>
      <Space
        direction="vertical"
        style={{
          padding: 10,
        }}
      >
        <Space>
          <Button type="primary" icon={<ReloadOutlined />} onClick={run}>
            刷新
          </Button>
          <div>
            汇率计算公式：（银行平均卖出价+银行平均买入价+中国人民银行基准价）/
            3
          </div>
        </Space>
        <List
          size="large"
          header={
            <>
              <Select defaultValue="CNY:CUR" options={options} />
              <Button type="primary" icon={<PlusOutlined />} onClick={run}>
                增加货币
              </Button>
            </>
          }
          bordered
          dataSource={list}
          renderItem={(item, idx) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: '#ffffff' }}
                    shape="square"
                    size={24}
                    icon={
                      <div
                        className={getIconClassName(item.iso, 24)}
                        style={{ backgroundImage: `url(${iconImg})` }}
                      ></div>
                    }
                  />
                }
              />
              <InputNumber
                className={styles.number}
                min={0}
                addonBefore={
                  <DeleteFilled
                    style={{ color: 'red', cursor: 'pointer' }}
                    onClick={() => setList(list.slice(idx))}
                  />
                }
                prefix={item.title}
                style={{ width: '100%' }}
                value={item.value}
                onChange={(value) => onInputNumberChange(value, item.iso)}
              />
            </List.Item>
          )}
        />
      </Space>
    </Spin>
  );
}
