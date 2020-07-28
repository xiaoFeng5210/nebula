import request from '@/utils/request';
// 场景：视口新增
export function addViewport(data) {
  return request.post('api/bjbusiness/scene-viewport/add', data);
}
// 场景：视口删除
export function deleteViewport(data) {
  return request.post('api/bjbusiness/scene-viewport/delete', data);
}
// 场景：获取视口列表
export function getViewport(data) {
  return request.post('api/bjbusiness/scene-viewport/list', data);
}