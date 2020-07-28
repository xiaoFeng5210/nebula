import CryptoJS from 'crypto-js';

//  1.如果加密解密涉及到前端和后端，则这里的key要保持和后端的key一致
//  2.AES的算法模式有好几种（ECB,CBC,CFB,OFB），所以也要和后端保持一致
//  3.AES的补码方式有两种（PKS5，PKS7），所以也要和后端保持一致
//  4.AES的密钥长度有三种（128,192,256，默认是128），所以也要和后端保持一致
//  5.AES的加密结果编码方式有两种（base64和十六进制），具体怎么选择由自己定，但是加密和解密的编码方式要统一

// 秘钥
const key = CryptoJS.enc.Utf8.parse('oC86T4NeB5v6duLkmgcJ6Q==');

// 加密
export default {
  encrypt(str) {
    var encryptedData = CryptoJS.AES.encrypt(str, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encryptedData.ciphertext.toString();
  },
  // 解密
  decrypt(encryptedStr) {
    var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedStr);
    var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decryptedData.toString(CryptoJS.enc.Utf8);
  },
  // base64转blob   base64转图片
  base64ToBlob(base64Data) {
    const arr = base64Data.split(',');
    const fileType = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let l = bstr.length;
    const u8Arr = new Uint8Array(l);
    while (l--) {
      u8Arr[l] = bstr.charCodeAt(l);
    }
    const letaa = new Blob([u8Arr], {
      type: fileType
    });
    const bbb = this.blobToFile(letaa, 'dfdfd.png');
    return bbb;
  },
  // blob转file
  blobToFile(newBlob, fileName) {
    newBlob.lastModifiedDate = new Date();
    newBlob.name = fileName;
    return newBlob;
  }
};
