import request from '@/utils/request';

//  拿到企业名称去查询接口校验是否重复
export const httpFindCompanyName = data => {
  return request({
    url: 'api/bjbasicdata/company/findByCompanyName',
    method: 'post',
    data
  });
};

export const httpCreateCompany = data => {
  return request({
    url: 'api/bjbasicdata/company/save',
    method: 'post',
    data
  });
};

// 根据公司id去查找公司信息
export function companyFindById(data) {
  return request({
    url: 'api/bjbasicdata/company/findById',
    method: 'post',
    data
  });
}
