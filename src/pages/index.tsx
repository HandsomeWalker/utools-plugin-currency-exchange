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
  InputNumber,
  Avatar,
} from 'antd';
import {
  ReloadOutlined,
  PlusOutlined,
  DragOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useState, useCallback, useMemo, useReducer, useRef } from 'react';
import { getIconClassName, simpleDeepCopy } from '@/utils';
import { multiply, divide, fix } from 'mathjs';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';

interface ListItemProps {
  iso: string;
  title: string;
  value: number;
}

const options = currency.map((item, idx) => ({ ...item, key: idx }));

function listReducer(
  state: ListItemProps[],
  { type, payload }: { type: 'add' | 'remove' | 'update'; payload: any },
): ListItemProps[] {
  switch (type) {
    case 'add':
      return state.concat(payload);
    case 'remove':
      return state.filter((item) => item.iso !== payload.iso);
    case 'update':
      return payload;
    default:
      return state;
  }
}

const DragHandle: any = SortableHandle(() => (
  <DragOutlined style={{ cursor: 'move' }} />
));

export default function IndexPage() {
  const [currSelect, setCurrSelect] = useState<ListItemProps>({
    title: '人名币(CNY)',
    iso: 'CNY:CUR',
    value: 0,
  });
  const [list, dispatchList] = useReducer(listReducer, [
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
      message.error('请求汇率数据出错，请点击更新汇率重试');
    },
  });

  const onInputNumberChange = useCallback(
    (value, iso, items) => {
      if (value === null) {
        return;
      }
      let temp = simpleDeepCopy(items);
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
      dispatchList({ type: 'update', payload: temp });
    },
    [price],
  );

  const SortableItem: any = useMemo(
    () =>
      SortableElement(({ item, items }: any) => (
        <div
          style={{
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            width: 380,
          }}
        >
          <Avatar
            style={{ backgroundColor: '#ffffff', marginRight: 5 }}
            shape="square"
            size={24}
            icon={
              <div
                className={getIconClassName(item.iso, 24)}
                style={{ backgroundImage: `url(${iconImg})` }}
              ></div>
            }
          />
          <InputNumber
            className={styles.number}
            min={0}
            controls={false}
            addonBefore={<DragHandle />}
            addonAfter={
              <DeleteOutlined
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => dispatchList({ type: 'remove', payload: item })}
              />
            }
            prefix={item.title}
            style={{ width: 340 }}
            value={item.value}
            onChange={(value) => onInputNumberChange(value, item.iso, items)}
            onClick={(e) => (e.target as any).select()}
          />
        </div>
      )),
    [price],
  );

  const SortableList: any = useMemo(
    () =>
      SortableContainer(({ items }: any) => {
        return (
          <div style={{ display: 'flex', flexFlow: 'wrap' }}>
            {items.map((item: any, index: number) => (
              <SortableItem
                key={item.iso}
                index={index}
                item={item}
                items={items}
              />
            ))}
          </div>
        );
      }),
    [price],
  );

  return (
    <Spin spinning={loading}>
      <Space
        direction="vertical"
        style={{
          padding: 10,
          width: '100%',
        }}
      >
        <Space>
          <Button type="primary" icon={<ReloadOutlined />} onClick={run}>
            更新汇率
          </Button>
          <div>
            汇率计算公式：（银行平均卖出价+银行平均买入价+中国人民银行基准价）/
            3
          </div>
        </Space>
        <Space>
          <Select
            labelInValue
            showSearch
            style={{ minWidth: 200 }}
            defaultValue="CNY:CUR"
            options={options}
            optionFilterProp="label"
            onChange={({ label, value }: any) => {
              setCurrSelect({
                title: label,
                iso: value,
                value: 0,
              });
            }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              if (list.filter((item) => item.iso === currSelect.iso).length) {
                message.error({
                  content: `列表已存在：${currSelect.title}`,
                  key: 'msg',
                });
              } else {
                message.success({
                  content: `已添加货币：${currSelect.title}`,
                  key: 'msg',
                });
                dispatchList({ type: 'add', payload: currSelect });
              }
            }}
          >
            增加货币
          </Button>
        </Space>
        <SortableList useDragHandle items={list} axis="xy" />
      </Space>
    </Spin>
  );
}
