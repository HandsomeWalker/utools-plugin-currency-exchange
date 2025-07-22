import '@/styles/icon.css';
import iconImg from '@/assets/24.png';
import styles from './index.less';
import useRequest from '@/hooks/useRequest';
import {
  Select,
  Space,
  Spin,
  message,
  Button,
  InputNumber,
  Avatar,
  Divider,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  DragOutlined,
  DeleteOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
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
import { getCurrency, getPrice } from '@/apis';
import classnames from 'classnames';

interface ListItemProps {
  iso: string;
  title: string;
  value: number;
}

export default function IndexPage() {
  const [fastPayload, setFastPayload] = useState<any>(0);
  const [currSelect, setCurrSelect] = useState<ListItemProps>({
    title: '人民币(CNY)',
    iso: 'CNY',
    value: 0,
  });
  const [list, dispatchList] = useReducer(listReducer, layout);
  const [fixCount, setFixCount] = useState<number>(savedFixCount);
  const [isShowHeader, setIsShowHeader] = useState<boolean>(true);
  const [isDarkColor, setIsDarkColor] = useState<boolean>(false);

  const { data: currencyOptions = [], loading: loadingCurrency } = useRequest(
    () => getCurrency({ s: 'fcr' }),
    {
      formatResult(data) {
        let ret: any[] = [];
        for (const item of data) {
          if (ret.filter((each) => each.flag === item.flag).length === 0) {
            let title = item.title;
            if (item.flag === 'cn.png') {
              title = '人民币';
            }
            if (item.flag === 'tw.png') {
              title = '中国台湾新台币';
            }
            ret.push({ ...item, title: `${title}(${item.iso})` });
          }
        }
        return ret;
      },
    },
  );

  const {
    data: price,
    loading,
    run,
  } = useRequest(
    () => getPrice(list.map((item) => item.iso.replace(/:CUR/g, ''))),
    {
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
    },
  );

  useEffect(() => {
    utools.onPluginEnter(({ code, payload }: any) => {
      // 判断是否暗黑模式
      const darkLink = document.getElementById('antd-dark');
      setIsDarkColor(utools.isDarkColors());
      if (utools.isDarkColors()) {
        if (!darkLink) {
          const link = document.createElement('link');
          link.id = 'antd-dark';
          link.rel = 'stylesheet';
          link.href = './antd.dark.min.css';
          document.body.style.backgroundColor = '#303133';
          document.head.append(link);
        }
      } else {
        document.body.style.backgroundColor = '#ffffff';
        darkLink?.remove();
      }
      if (code === 'fast') {
        setFastPayload(payload?.replace(/(,|，)/g, ''));
      }
      run();
    });
  }, []);

  const onInputNumberChange = useCallback(
    (value, iso, items, price, fix = fixCount) => {
      if (value === null) {
        return;
      }
      let temp = simpleDeepCopy(items);
      for (const item of temp) {
        if (item.iso === iso) {
          item.value = value;
        } else {
          item.value = getExchangedValue(price, item, value, iso, fix);
        }
      }
      dispatchList({ type: 'update', payload: temp });
      setFastPayload(0);
    },
    [fixCount],
  );

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
            title={`${item.title}: ${item.value}`}
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
            prefix={<div className={styles.prefix}>{item.title}</div>}
            style={{ width: 340 }}
            value={item.value}
            onChange={(value) =>
              onInputNumberChange(value, item.iso, items, price)
            }
            onClick={(e) => (e.target as any).select()}
          />
        </div>
      )),
    [price, fixCount],
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
    [price, fixCount],
  );

  return (
    <Spin spinning={loading}>
      <div
        style={{
          padding: 10,
          paddingTop: 0,
          width: '100%',
        }}
      >
        <div
          className={classnames(
            styles.header,
            isShowHeader ? '' : styles.hidden,
          )}
        >
          <Space>
            <InputNumber
              value={fixCount}
              min={0}
              max={10}
              onClick={(e) => (e.target as any).select()}
              onChange={async (val) => {
                if (typeof val === 'number') {
                  utools.dbStorage.setItem('fixCount', val);
                  onInputNumberChange(
                    list[0].value,
                    list[0].iso,
                    list,
                    price,
                    val,
                  );
                  setFixCount(val);
                }
              }}
              prefix="保留位数"
              style={{ width: 110 }}
            />
            <Select
              labelInValue
              showSearch
              loading={loadingCurrency}
              style={{ minWidth: 200 }}
              options={currencyOptions}
              optionFilterProp="title"
              defaultValue={'cn.png'}
              fieldNames={{
                label: 'title',
                value: 'flag',
              }}
              tabIndex={-1}
              onChange={({ label, value }: any) => {
                setCurrSelect({
                  title: label,
                  iso: label.replace(/(.+\(|\))/g, ''),
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
                      value: 0,
                    },
                  });
                  run();
                }
              }}
            >
              添加货币
            </Button>
          </Space>
        </div>
        <div
          className={classnames(
            styles.trapezoid,
            isDarkColor ? styles.dark : '',
          )}
          onClick={() => {
            setIsShowHeader(!isShowHeader);
          }}
        >
          <CaretUpOutlined
            className={classnames(
              styles.icon,
              !isShowHeader ? styles.reverse : '',
            )}
          />
        </div>
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

function fixCountReducer(state: number, payload: number) {
  utools.dbStorage.setItem('fixCount', payload);
  return payload;
}

const DragHandle: any = SortableHandle(() => (
  <DragOutlined style={{ cursor: 'move' }} />
));

function getExchangedValue(
  price: any,
  item: ListItemProps,
  value: number,
  iso: string,
  fixCount: number,
) {
  let ret: number;
  try {
    ret = fix(
      divide(
        multiply(price[item.iso.replace(/:CUR/g, '')], value),
        price[iso.replace(/:CUR/g, '')],
      ) as number,
      fixCount,
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
    iso: 'CNY',
    value: 0,
  },
  {
    title: '阿根廷比索(ARS)',
    iso: 'ARS',
    value: 0,
  },
  {
    title: '土耳其里拉(TRY)',
    iso: 'TRY',
    value: 0,
  },
  {
    title: '港币(HKD)',
    iso: 'HKD',
    value: 0,
  },
  {
    title: '俄罗斯卢布(RUB)',
    iso: 'RUB',
    value: 0,
  },
  {
    title: '美元(USD)',
    iso: 'USD',
    value: 0,
  },
];

const savedFixCount = utools.dbStorage.getItem('fixCount') || 2;
