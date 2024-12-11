import { message } from 'antd';

function qs(obj: any) {
  let ret = '';
  for (const key in obj) {
    const value = obj[key];
    ret += `${key}=${value}&`;
  }
  return ret.slice(0, ret.length - 1);
}

function request(params: any) {
  // preload中请求,如需手动设置代理，请使用下面代码
  // return (window as any).apiAction({ ...params, ln: 'zh-hans' });
  // 前端请求，可自动http代理
  return fetch(
    `https://freecurrencyrates.com/api/action.php?${qs({
      ...params,
      ln: 'zh-hans',
    })}`,
  ).then((res) => res.json());
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
