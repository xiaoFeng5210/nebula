import request from '@/utils/request';

// 根据部门id 赋予部门下用户角色
export function deptGiveRoleAndDeptId(data) {
  return request({
    url: 'api/bjbasicdata/sysDept/giveRoleAndDeptId',
    method: 'post',
    data
  });
}

// 得到该公司或该项目的所有的部门
export function deptGetAllDept(data) {
  return request({
    url: 'api/bjbasicdata/sysDept/getAllDept',
    method: 'post',
    data
  });
}

// 新增部门
export function deptSave(data) {
  return request({
    url: 'api/bjbasicdata/sysDept/save',
    method: 'post',
    data
  });
}

// 根据id删除部门
export function deptDelById(data) {
  return request({
    url: 'api/bjbasicdata/sysDept/delById',
    method: 'post',
    data
  });
}
// 系统部门表修改接口
export function deptUpdate(data) {
  return request({
    url: 'api/bjbasicdata/sysDept/update',
    method: 'post',
    data
  });
}

// 一层一层查询组织信息（顶层组织parentId = "0"
//  次级组织parentId）（deptType=0默认，deptType=1非默认）
export function deptQuery(data) {
  return request({
    url: 'api/bjbasicdata/sysDept/query',
    method: 'post',
    data
  });
}
// 系统部门表修改接口
export function deptFindById(data) {
  return request({
    url: 'api/bjbasicdata/sysDept/findById',
    method: 'post',
    data
  });
}
