import request from '@/utils/request';

//  获取列表
export function getPostilList(data) {
  return request.post('api/bjbusiness/scene-postil/list', data);
}
//  查看详情
export function lookPostilList(data) {
  return request.post('api/bjbusiness/scene-postil/view', data);
}

//  添加批注
export function addPostilList(data) {
  return request.post('api/bjbusiness/scene-postil/add', data);
}

//  删除批注
export function delPostilList(data) {
  return request.post('api/bjbusiness/scene-postil/delete', data);
}
