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
  Tooltip,
  Divider,
  Empty,
} from 'antd';
import {
  ReloadOutlined,
  PlusOutlined,
  DragOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useState, useCallback, useMemo, useReducer, useEffect } from 'react';
import { getIconClassName, simpleDeepCopy, sortArrayByIndex } from '@/utils';
import { multiply, divide, fix } from 'mathjs';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEnd,
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
  let ret: ListItemProps[];
  switch (type) {
    case 'add':
      ret = state.concat([payload]);
      break;
    case 'remove':
      const temp = state.filter((item) => item.iso !== payload.iso);
      if (temp.length) {
        ret = temp;
      } else {
        message.error({
          content: '请至少保留一种货币',
          key: 'msg',
        });
        ret = state;
      }
      break;
    case 'update':
      ret = payload;
      break;
    default:
      ret = state;
      break;
  }
  utools.dbStorage.setItem('layout', ret);
  return ret;
}

const DragHandle: any = SortableHandle(() => (
  <DragOutlined style={{ cursor: 'move' }} />
));

function getExchangedValue(
  price: any,
  item: ListItemProps,
  value: number,
  iso: string,
) {
  let ret: number;
  try {
    ret = fix(
      divide(multiply(price[item.iso], value), price[iso]) as number,
      2,
    );
  } catch (e) {
    console.log(e);
    ret = 0;
  }
  return ret;
}

const layout: ListItemProps[] = utools.dbStorage.getItem('layout') || [
  {
    title: '人民币(CNY)',
    iso: 'CNY:CUR',
    value: 0,
  },
  {
    title: '阿根廷比索(ARS)',
    iso: 'ARS:CUR',
    value: 0,
  },
  {
    title: '土耳其里拉(TRY)',
    iso: 'TRY:CUR',
    value: 0,
  },
  {
    title: '港币(HKD)',
    iso: 'HKD:CUR',
    value: 0,
  },
  {
    title: '俄罗斯卢布(RUB)',
    iso: 'RUB:CUR',
    value: 0,
  },
  {
    title: '美元(USD)',
    iso: 'USD:CUR',
    value: 0,
  },
];

// let map: any = {};
// for (const item of currency) {
//   map[item.value] ? map[item.value].push(item) : (map[item.value] = [item]);
// }
// for (const key in map) {
//   if (map[key].length > 1) {
//     console.log(map[key]);
//   }
// }

export default function IndexPage() {
  const [fastPayload, setFastPaload] = useState<any>(0);
  const [currSelect, setCurrSelect] = useState<ListItemProps>({
    title: '人民币(CNY)',
    iso: 'CNY:CUR',
    value: 0,
  });
  const [list, dispatchList] = useReducer(listReducer, layout);

  const {
    data: price,
    loading,
    run,
  } = useRateScript({
    onSuccess(price) {
      list.length &&
        onInputNumberChange(
          fastPayload || list[0].value,
          list[0].iso,
          list,
          price,
        );
    },
    onError(e) {
      message.error({
        content: '请求汇率数据出错，请重试',
        key: 'msg',
      });
    },
  });

  useEffect(() => {
    utools.onPluginEnter(({ code, payload }: any) => {
      if (code === 'fast') {
        setFastPaload(payload);
      }
      run();
    });
  }, []);

  const onInputNumberChange = useCallback((value, iso, items, price) => {
    if (value === null) {
      return;
    }
    let temp = simpleDeepCopy(items);
    for (const item of temp) {
      if (item.iso === iso) {
        item.value = value;
      } else {
        item.value = getExchangedValue(price, item, value, iso);
      }
    }
    dispatchList({ type: 'update', payload: temp });
    setFastPaload(0);
  }, []);

  const SortableItem: any = useMemo(
    () =>
      SortableElement(({ item, items }: any) => (
        <div
          style={{
            marginBottom: 10,
            marginLeft: 13,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar
            style={{ backgroundColor: 'transparent', marginRight: 5 }}
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
            onChange={(value) =>
              onInputNumberChange(value, item.iso, items, price)
            }
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
      <div
        style={{
          padding: 10,
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Select
              labelInValue
              showSearch
              style={{ minWidth: 200 }}
              defaultValue="CNY:CUR"
              options={options}
              optionFilterProp="label"
              tabIndex={-1}
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
              tabIndex={-1}
              onClick={() => {
                if (list.filter((item) => item.iso === currSelect.iso).length) {
                  message.error({
                    content: '重复添加',
                    key: 'msg',
                  });
                } else {
                  dispatchList({
                    type: 'add',
                    payload: {
                      ...currSelect,
                      value: list.length
                        ? getExchangedValue(
                            price,
                            currSelect,
                            list[0].value,
                            list[0].iso,
                          )
                        : 0,
                    },
                  });
                }
              }}
            >
              添加货币
            </Button>
          </Space>
          <Space>
            <Tooltip title="汇率计算公式：（银行平均卖出价+银行平均买入价+中国人民银行基准价）/ 3">
              <InfoCircleOutlined style={{ cursor: 'pointer' }} />
            </Tooltip>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={run}
              tabIndex={-1}
            >
              更新实时汇率
            </Button>
          </Space>
        </div>
        <Divider />
        {list.length ? (
          <SortableList
            useDragHandle
            items={list}
            axis="xy"
            onSortEnd={({ oldIndex, newIndex }: SortEnd) => {
              if (newIndex !== oldIndex) {
                dispatchList({
                  type: 'update',
                  payload: sortArrayByIndex(list, oldIndex, newIndex),
                });
              }
            }}
          />
        ) : (
          <Empty description="请添加货币" />
        )}
      </div>
    </Spin>
  );
}
