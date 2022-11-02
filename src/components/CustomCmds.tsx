import { Button, List, Space, Input } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { FnDialog } from '@/utils';

interface CustomCmdsProps {}

function ModalContent({ features }: { features: any }) {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button type="primary" icon={<PlusOutlined />}></Button>
      <List
        bordered
        dataSource={features}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Space>
  );
}

function openCustomCmdsModal() {
  const features = utools.getFeatures();
  FnDialog.open({
    title: '唤起关键词',
    okText: '保存',
    content: <ModalContent features={features} />,
  });
}

function CustomCmds({}: CustomCmdsProps) {
  return (
    <Button icon={<SettingOutlined />} onClick={openCustomCmdsModal}>
      唤起关键词
    </Button>
  );
}

export default CustomCmds;
