import request from '@/utils/request';
// 工作台：主页列表接口
export function worktableList(data) {
  return request.post('api/bjbusiness/bench/listAll', data);
}
// 工作台：项目访问量数据
export function projectVisited(data) {
  return request.post('api/bjbasicdata/project/projectVisited', data);
}
// 工作台：获取天气
export function weather(data) {
  return request.post('api/bjbasicdata/weather', data);
}
// 工作台：根据类型分别工作台列表
export function listByType(data) {
  return request.post('api/bjbusiness/bench/listByType', data);
}
// 工作台：更新状态的接口
export function updateStatus(data) {
  return request.post('api/bjbusiness/bench/updateStatus', data);
}
// 工作台：最近预览项目列表
export function historyProjectList(data) {
  return request.post('api/bjbasicdata/project/getHistoryProjectList', data);
}
// 搜索项目
export function searchProject(data) {
  return request.post('api/bjbasicdata/project/findLikeContent', data);
}
// 获取当前位置
export function getLocation() {
  return request.get('tianqi/');
}
// 获取企业下所有项目
export function projectAll(data) {
  return request.post('api/bjbasicdata/project/getListByCompanyId', data);
}
// 获取消息数量
export function newsCount(data) {
  return request.post('api/bjbusiness/bench/messageCount', data);
}
// 发布公告
export function addAnnounce(data) {
  return request.post('api/bjbusiness/bench/addMessage', data);
}

