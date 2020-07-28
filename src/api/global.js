import request from '@/utils/request';
// 切换企业
export function companyList(data) {
  return request.post('api/bjbasicdata/userCompany/listByUserId', data);
}
// 获取模型上传进度列表
export function modelProgress(data) {
  return request.get('api/bjbusiness/modelFile/getProjectConvertingProgress/' + data);
}
// 模型上传成功列表
export function successList(data) {
  return request.post('api/bjbusiness/modelFile/list', data);
}
// 停止/启动模型上传的接口
export function stopUpload(data) {
  return request.post('api/bjbusiness/modelFile/stopOrStartConvertingProject', data);
}
// 按角色
export function getRole(data) {
  return request.post('api/bjbasicdata/sysRole/getAnnouncementRoleUser', data);
}
// 按组织
export function getRoleByStaff(data) {
  return request.post('api/bjbasicdata/sysDept/getAnnouncementDeptUser', data);
}