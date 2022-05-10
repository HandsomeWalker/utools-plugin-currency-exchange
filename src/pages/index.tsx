import styles from './index.less';
import currency from '@/assets/currency.json';
import { Select } from 'antd';

const options = currency.map((item, idx) => ({ ...item, key: idx }));
async function getData() {
  const data = await (window as any).getRateScript();
  const script = document.createElement('script');
  script.innerText = data;
  document.body.appendChild(script);
}
getData();

export default function IndexPage() {
  return (
    <div>
      <Select defaultValue="CNY:CUR" options={options} />
    </div>
  );
}
