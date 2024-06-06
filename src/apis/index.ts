import { message } from 'antd';
import { apiAction } from '@/request';
function request(params: any) {
  return apiAction({ ...params, ln: 'zh-hans' });
}

export const getSource = function () {
  return request({ do: 'slist' }).catch(() =>
    message.error({
      content: '获取Source失败',
      key: 'msg',
    }),
  );
};

export const getCurrency = function (params: { s: string }) {
  return request({ do: 'clist', ...params }).catch(() => {
    message.error({
      content: '获取货币失败',
      key: 'msg',
    });
  });
};

export const getPrice = function (params: any[]) {
  return request({
    s: 'fcr',
    f: 'USD',
    v: 1,
    do: 'cvals',
    iso: params.join('-'),
  }).catch(() => {
    message.error({
      content: '获取汇率失败',
      key: 'msg',
    });
  });
};
