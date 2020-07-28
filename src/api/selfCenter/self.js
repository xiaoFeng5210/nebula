import request from '@/utils/request';
export const httpGetUserInfo = (data) => {
  return request({
    url: 'api/bjbasicdata/personalCore/findAll',
    method: 'post',
    data
  });
};

export const httpGetCode = data => {
  return request({
    url: 'api/bjbasicdata/sms/sendSms',
    method: 'post',
    data
  });
};

export const httpValidateSms = (data) => {
  return request({
    url: 'api/bjbasicdata/sms/accept/sms',
    method: 'post',
    data
  });
};

export const httpFixPhone = data => {
  return request({
    url: 'api/bjbasicdata/updateMobile',
    method: 'post',
    data
  });
};

// 修改密码接口
export const httpFixPassWord = data => {
  return request({
    url: 'api/bjbasicdata/updatePassWord',
    method: 'post',
    data
  });
};
