/**
 * 文件图片枚举
 * @type {{dwg: string}}
 */
export const documentEnum = {
  file: require('../assets/fileType/paperfile.png'),
  dwg: require('../assets/fileType/dwg.png')
};

/**
 * 标记图片枚举
 * @type {{dwg: string}}
 */
export const badgeImage = {
  blue: require('../assets/badge/blue.png'),
  red: require('../assets/badge/red.png'),
  yellow: require('../assets/badge/yellow.png'),
  green: require('../assets/badge/green.png')
};

/**
 * 下载
 */
export const exportResponseToFile = (data, file) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  // tslint:disable-next-line
  link.setAttribute('download', file);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 创建a标签下载
 */
export const exportFile = (url, fileName) => {
  // const url = url;
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
