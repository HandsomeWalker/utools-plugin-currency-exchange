import { Button, List, Space, Input, Select } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { FnDialog } from '@/utils';
import { useMemo, useState } from 'react';

interface ListItemProps {
  iso: string;
  title: string;
  value: number;
}

interface CustomCmdsProps {
  list: ListItemProps[];
}

function ModalContent({
  features,
  list,
}: {
  features: any;
  list: ListItemProps[];
}) {
  const options = useMemo(
    () => list.map((item) => ({ label: item.title, value: item.iso })),
    [list],
  );
  const [currSelect, setCurrSelect] = useState(options[0]);
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Select
          labelInValue
          defaultValue={options[0]}
          options={options}
          style={{ minWidth: 200 }}
          onChange={(val: { label: string; value: string }) => {
            setCurrSelect(val);
          }}
        />
        <Button type="primary" icon={<PlusOutlined />}></Button>
      </Space>
      <List
        bordered
        dataSource={features}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Space>
  );
}

function openCustomCmdsModal(list: ListItemProps[]) {
  const features = utools.getFeatures();
  FnDialog.open({
    title: '唤起关键词',
    okText: '保存',
    content: <ModalContent features={features} list={list} />,
  });
}

function CustomCmds({ list }: CustomCmdsProps) {
  return (
    <Button
      icon={<SettingOutlined />}
      onClick={() => openCustomCmdsModal(list)}
    >
      唤起关键词
    </Button>
  );
}

export default CustomCmds;
