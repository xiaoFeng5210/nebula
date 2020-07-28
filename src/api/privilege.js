import request from '@/utils/request';

// 得到公司所有的角色(包含默认以及此公司自己创建的)
export function getAllRoles(data) {
  return request.get('api/bjbasicdata/sysRole/getCompanyAllRole/' + data);
}

// 获取角色权限资源列表
export function getResourceList() {
  return request.get('api/bjbasicdata/sysResources/getPlatformCompanyMenu/');
}

//  根据角色id 拿到已经授权的D资源idLP
export function getDefaultPermis(data) {
  return request.get('api/bjbasicdata/sysResources/findResourcesIdByRoleId/' + data);
}

//  为用户赋予角色
export function addPostilList(data) {
  return request.post('api/bjbasicdata/sysRole/givePermissions/', data);
}

//  添加角色
export function saveSysRole(data) {
  return request.post('api/bjbasicdata/sysRole/save/', data);
}
