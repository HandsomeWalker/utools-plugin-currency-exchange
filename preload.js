const https = require('https');
const { HttpsProxyAgent } = require('https-proxy-agent');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36';

const agent = new HttpsProxyAgent('http://127.0.0.1:7890');
function qs(obj) {
  let ret = '';
  for (const key in obj) {
    const value = obj[key];
    ret += `${key}=${value}&`;
  }
  return ret.slice(0, ret.length - 1);
}

function request(options, cb) {
  const req = https.request(options, function (res) {
    let html = '';
    res.setEncoding('utf-8');
    res.on('data', function (data) {
      html += data;
    });
    res.on('end', function () {
      cb(null, html);
    });
  });
  req.on('error', (err) => {
    cb(err);
  });
  req.end();
}

window.getRateScript = function () {
  return new Promise((resolve, reject) => {
    request(
      {
        hostname: 'www.usd-cny.com',
        path: '/hv.js',
        port: 443,
        method: 'GET',
        agent,
        headers: {
          'user-agent': UA,
        },
      },
      function (err, body) {
        if (err) {
          reject(err);
        }
        resolve(
          body.replace(/window\.onload=function/g, 'function a') +
            '\nwindow.prize = price;',
        );
      },
    );
  });
};

window.apiAction = function (params) {
  return new Promise((resolve, reject) => {
    request(
      {
        hostname: 'freecurrencyrates.com',
        path: `/api/action.php?${qs(params)}`,
        port: 443,
        method: 'GET',
        agent,
        headers: {
          'user-agent': UA,
        },
      },
      function (err, body) {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(body));
      },
    );
  });
};
