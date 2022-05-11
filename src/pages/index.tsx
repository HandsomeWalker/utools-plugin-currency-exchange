import styles from './index.less';
import currency from '@/assets/currency.json';
import useRateScript from '@/hooks/useRateScript';
import { Select, Space, Spin, message, Button, List, InputNumber } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface ListItemProps {
  icon: React.ReactNode;
  title: string;
}

const options = currency.map((item, idx) => ({ ...item, key: idx }));

export default function IndexPage() {
  const [list, setList] = useState<ListItemProps[]>([
    {
      title: '人名币(CNY)',
      icon: null,
    },
    {
      title: '美元(USD)',
      icon: null,
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
          <Button type="primary" icon={<PlusOutlined />} onClick={run}>
            增加货币
          </Button>
        </Space>
        <Select defaultValue="CNY:CUR" options={options} />
        <List
          size="large"
          header={
            <div>
              汇率计算公式：（银行平均卖出价+银行平均买入价+中国人民银行基准价）/
              3
            </div>
          }
          bordered
          dataSource={list}
          renderItem={(item) => (
            <List.Item>
              <InputNumber
                className={styles.number}
                min={0}
                addonBefore={item.title}
                style={{ width: '100%' }}
              />
            </List.Item>
          )}
        />
      </Space>
    </Spin>
  );
}
