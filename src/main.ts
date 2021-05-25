import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');
import {appId, appSecret} from './private';

export const translate = (word) => {
    const salt = Math.random();
    const sign = md5(appId + word + salt + appSecret);

    const query: string = querystring.stringify({
        q: word,
        from: 'en',
        to: 'zh',
        appid: appId,
        salt: salt,
        sign: sign
    });

    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        let chunks = [];
        response.on('data', (chunk) => {
            chunks.push(chunk);
            // data : 每次下载得到的数据
        });
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString();
            type BaiduResult = { // 类型别名
                error_code?: string, // error_code 可能没有，但如果有就一定是字符串
                error_msg?: string,
                form: string,
                to: string,
                trans_result: {
                    src: string;
                    dst: string;
                }[] // 是一个对象数组
            }
            const object: BaiduResult = JSON.parse(string);
            if (object.error_code) {
                if (object.error_code === '52003') {
                    console.log('用户认证失败');
                } else if (object.error_code === '52004') {
                    console.log('...');
                } else {
                    console.error(object.error_msg);
                }
                process.exit(2); // 退出当前进程
                // 随便给个不是 0 的数字即可
            } else {
                console.log(object.trans_result[0].dst);
                process.exit(0); // 0 表示没有错误
            }
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};