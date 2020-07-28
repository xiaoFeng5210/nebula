import request from '../../utils/request';
export function findById(data) {
  return request({
    url: 'api/bjbasicdata/project/findById',
    method: 'post',
    data
  });
}

// 项目人员列表
export function getProuser(data) {
  return request.post('api/bjbasicdata/userProject/projectUserList', data);
}

// 获取公司所有的角色
export function getCompanyAllRole(data) {
  return request.get('api/bjbasicdata/sysRole/getCompanyAllRole/' + data);
}

// 获取公司所有的岗位
export function getProjectName(data) {
  return request.get('api/bjbasicdata/sysJob/getAllByProjectId/' + data);
}

// 删除人员
export function deleteUser(data) {
  return request.get('api/bjbasicdata/userProject/delById/' + data);
}

// 项目人员列表编辑
export function EditUser(data) {
  return request.post('api/bjbasicdata/userProject/projectUserListEdit/', data);
}

//  人员审核

// 查询审核人员A
export function AuditUser(data) {
  return request.post('api/bjbasicdata/userProject/list', data);
}

// 审核通过
export function AgreeUser(data) {
  return request.post('api/bjbasicdata/userProject/examinationPassed/', data);
}
// 拒绝
export function RefuseUser(data) {
  return request.get('api/bjbasicdata/userProject/examinationFailure/' + data);
}

// 项目人员根据用户id 移动部门
export function UserMoveDept(data) {
  return request.post('api/bjbasicdata/userProject/userMoveDept', data);
}
