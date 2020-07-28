import request from '@/utils/request';

const baseUrl = 'api';

export const getSceneBadgeList = data => {
  return request({
    url: baseUrl + '/bjbusiness/scene-marker/list',
    method: 'post',
    data
  });
};

// 新建标记
export const interfaceCreateBadge = data => {
  return request({
    url: baseUrl + '/bjbusiness/scene-marker/add',
    method: 'post',
    data
  });
};

// 删除标记
export const deleteListItem = data => {
  return request({
    url: baseUrl + '/bjbusiness/scene-marker/delete',
    method: 'post',
    data
  });
};

// 获取评论列表
export const getDiscussList = data => {
  return request({
    url: baseUrl + '/bjbusiness/scene-bbs/list',
    method: 'post',
    data
  });
};

// 添加评论
export const httpAddDiscuss = data => {
  return request({
    url: baseUrl + '/bjbusiness/scene-bbs/add',
    method: 'post',
    data
  });
};

// 删除评论
export const deleteDiscuss = data => {
  return request({
    url: baseUrl + '/bjbusiness/scene-bbs/delete',
    method: 'post',
    data
  });
};
