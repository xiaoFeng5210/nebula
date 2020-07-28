import request from '../../utils/request';

// 公司人员列表
export function getCompanyUserList(data) {
  return request({
    url: 'api/bjbasicdata/userCompany/companyUserList',
    method: 'post',
    data
  });
}

// 公司人员列表编辑
export function companyUserListEdit(data) {
  return request({
    url: 'api/bjbasicdata/userCompany/companyUserListEdit',
    method: 'post',
    data
  });
}

// 用户和企业关联表保存
export function companyUserSave(data) {
  return request({
    url: 'api/bjbasicdata/userCompany/save',
    method: 'post',
    data
  });
}

// 根据id删除用户和企业关联表接口
export function companyUserDelById(data) {
  return request({
    url: 'api/bjbasicdata/userCompany/delById',
    method: 'post',
    data
  });
}

// 用户和企业关联表修改接口
export function companyUserUpdate(data) {
  return request({
    url: 'api/bjbasicdata/userCompany/update',
    method: 'post',
    data
  });
}

// 根据公司id查找公司套餐已使用详情
export function getPackageDetailsUsageS(params) {
  return request({
    url: 'api/bjbasicdata/companyServiceUsage/getPackageDetailsUsage/' + params,
    method: 'get'
  });
}
