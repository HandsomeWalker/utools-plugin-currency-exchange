const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36';

function qs(obj: Record<string, any>): string {
  let ret = '';
  for (const key in obj) {
    const value = obj[key];
    ret += `${key}=${value}&`;
  }
  return ret.slice(0, ret.length - 1);
}

async function request(url: string, options: RequestInit): Promise<string> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.text();
}

export const getRateScript = function (): Promise<string> {
  return new Promise((resolve, reject) => {
    request('https://www.usd-cny.com/hv.js', {
      method: 'GET',
      headers: {
        'user-agent': UA,
      },
    })
      .then((body) => {
        resolve(
          body.replace(/window\.onload=function/g, 'function a') +
            '\nwindow.prize = price;',
        );
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiAction = function (params: Record<string, any>): Promise<any> {
  return new Promise((resolve, reject) => {
    request(`https://freecurrencyrates.com/api/action.php?${qs(params)}`, {
      method: 'GET',
      headers: {
        'user-agent': UA,
      },
    })
      .then((body) => {
        resolve(JSON.parse(body));
      })
      .catch((err) => {
        reject(err);
      });
  });
};
