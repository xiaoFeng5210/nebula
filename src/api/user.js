import request from '@/utils/request';

//  注册
//  获取验证码
export function getcode(data) {
  return request.post('api/bjbasicdata/user/sendSms', data);
}
// 验证  数字验证码
export function verifycode(data) {
  return request.post('api/bjbasicdata/user/validateCheckCode', data);
}
// 注册
export function signIn(data) {
  return request.post('api/bjbasicdata/user/register', data);
}
// 登录
export function login(data) {
  return request.post('api/bjbasicdata/getToken', data);
}
// 二维码
export function getTicket() {
  return request.get('api/weChat/getTicket');
}
// 忘记密码验证码校验
export function validas(data) {
  return request.post('api/bjbasicdata/user/validateRetrieve', data);
}
//  密码修改
export function updatePass(data) {
  return request.post('api/bjbasicdata/user/updatePassword', data);
}

// 退出登录
export function logout(data) {
  return request.post('api/bjbasicdata/exitLogin', data);
}
export function findUser(data) {
  return request.post('api/findAlll', data);
}
// 其他接口…………
// 上传图片
export function upload(data) {
  return request.post('api/bjfiles/files/upload', data);
}
